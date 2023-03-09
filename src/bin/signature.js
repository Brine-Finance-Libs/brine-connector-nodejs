const { curves: eCurves, ec: EllipticCurve } = require('elliptic')
const constantPointsHex = require('./constant_points.json')
const BN = require('bn.js')
const hash = require('hash.js')
const assert = require('assert')
const encUtils = require('enc-utils')
const blockchainUtils = require('./blockchain_utils')
const zeroBn = new BN('0', 16)

// Generate BN of 1.
const oneBn = new BN('1', 16)

// Equals 2**251 + 17 * 2**192 + 1.
const prime = new BN(
  '800000000000011000000000000000000000000000000000000000000000001',
  16,
)

// Equals 2**251. This value limits msgHash and the signature parts.
const maxEcdsaVal = new BN(
  '800000000000000000000000000000000000000000000000000000000000000',
  16,
)

function assertInRange(input, lowerBound, upperBound, inputName = '') {
  const messageSuffix =
    inputName === '' ? 'invalid length' : `invalid ${inputName} length`
  assert(
    input.gte(lowerBound) && input.lt(upperBound),
    `Message not signable, ${messageSuffix}.`,
  )
}

/*
 This function receives a key seed and produces an appropriate StarkEx key from a uniform
 distribution.
 Although it is possible to define a StarkEx key as a residue between the StarkEx EC order and a
 random 256bit digest value, the result would be a biased key. In order to prevent this bias, we
 deterministically search (by applying more hashes, AKA grinding) for a value lower than the largest
 256bit multiple of StarkEx EC order.
*/
function grindKey(keySeed, keyValLimit) {
  const sha256EcMaxDigest = new BN(
    '1 00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000000',
    16,
  )
  const maxAllowedVal = sha256EcMaxDigest.sub(
    sha256EcMaxDigest.mod(keyValLimit),
  )
  let i = 0
  let key = hashKeyWithIndex(keySeed, i)
  i++
  // Make sure the produced key is devided by the Stark EC order, and falls within the range
  // [0, maxAllowedVal).
  while (!key.lt(maxAllowedVal)) {
    key = hashKeyWithIndex(keySeed.toString('hex'), i)
    i++
  }
  return key.umod(keyValLimit).toString('hex')
}

function hashKeyWithIndex(key, index) {
  return new BN(
    hash
      .sha256()
      .update(
        encUtils.hexToBuffer(
          encUtils.removeHexPrefix(key) +
            encUtils.sanitizeBytes(encUtils.numberToHex(index), 2),
        ),
      )
      .digest('hex'),
    16,
  )
}

const starkEc = new EllipticCurve(
  new eCurves.PresetCurve({
    type: 'short',
    prime: null,
    p: prime,
    a: '00000000 00000000 00000000 00000000 00000000 00000000 00000000 00000001',
    b: '06f21413 efbe40de 150e596d 72f7a8c5 609ad26c 15c915c1 f4cdfcb9 9cee9e89',
    n: '08000000 00000010 ffffffff ffffffff b781126d cae7b232 1e66a241 adc64d2f',
    hash: hash.sha256,
    gRed: false,
    g: constantPointsHex[1],
  }),
)

/*
 The function _truncateToN in lib/elliptic/ec/index.js does a shift-right of delta bits,
 if delta is positive, where
   delta = msgHash.byteLength() * 8 - starkEx.n.bitLength().
 This function does the opposite operation so that
   _truncateToN(fixMsgHashLen(msgHash)) == msgHash.
*/
function fixMsgHashLen(msgHash) {
  // Convert to BN to remove leading zeros.
  msgHash = new BN(msgHash, 16).toString(16)

  if (msgHash.length <= 62) {
    // In this case, msgHash should not be transformed, as the byteLength() is at most 31,
    // so delta < 0 (see _truncateToN).
    return msgHash
  }
  assert(msgHash.length === 63)
  // In this case delta will be 4 so we perform a shift-left of 4 bits by adding a zero.
  return msgHash + '0'
}

/*
 Signs a message using the provided key.
 privateKey should be an elliptic.keyPair with a valid private key.
 Returns an elliptic.Signature.
*/
function sign(privateKey, msgHash) {
  const msgHashBN = new BN(msgHash, 16)
  // Verify message hash has valid length.
  assertInRange(msgHashBN, zeroBn, maxEcdsaVal, 'msgHash')
  const msgSignature = privateKey.sign(fixMsgHashLen(msgHash))
  const { r, s } = msgSignature
  const w = s.invm(starkEc.n)
  // Verify signature has valid length.
  assertInRange(r, oneBn, maxEcdsaVal, 'r')
  assertInRange(s, oneBn, starkEc.n, 's')
  assertInRange(w, oneBn, maxEcdsaVal, 'w')
  return msgSignature
}

/*
 Derives key-pair from given mnemonic string and path.
 mnemonic should be a sentence comprised of 12 words with single spaces between them.
 path is a formatted string describing the stark key path based on the layer, application and eth
 address.
*/
function getKeyPairFromSignature(signature) {
  const keySeed = blockchainUtils.getKeySeed(signature)
  const starkEcOrder = starkEc.n
  return starkEc.keyFromPrivate(grindKey(keySeed, starkEcOrder), 'hex')
}

module.exports = {
  sign,
  getKeyPairFromSignature,
}
