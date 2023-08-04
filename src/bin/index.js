// Please remove this when BE is ready.

const { ethers, Wallet } = require('ethers');
const erc20Contract = require('../utils/contracts/erc20_abi.json');
const starkContract = require('../utils/contracts/polygon_deposit.json');

const provider = new ethers.providers.JsonRpcProvider(''); // place rpc , you can get it from infura,alchemy,or ask user to send provider as arg

// Set the contract address and ABI

const contractAddress = ''; // get from BE // -> /stat/v2/coins/ -> post request

// 'mainnet' : '0x1390f521A79BaBE99b69B37154D63D431da27A07'
// 'testnet' : '0x87eB0b1B5958c7fD034966925Ea026ad8Bf3d6dD',

// Set the user's wallet address
const userAddress = '0x6c875514E42F14B891399A6a8438E6AA8F77B178';
const privateKey = ''; // place the private of user,ask user to send sender as arg directly

// Replace the signer and provider with wallet one.
const contract = new ethers.Contract(tokenAddress, erc20Contract, provider);
const signer = new Wallet(privateKey, provider);

let starkContract = new ethers.Contract(contractAddress, starkContract, signer);

function dequantize(number, decimals) {
  const factor = 10 ** decimals;
  return number / factor;
}

// getting allowance
async function getAllowance() {
  try {
    const allowance = await contract.allowance(userAddress, contractAddress);
    console.log('Allowance:', dequantize(Number(allowance), 18));
  } catch (error) {
    console.error('Error:', error);
  }
}

//
async function approveUnlimitedAllowance() {
  try {
    let contract_final = new ethers.Contract(
      tokenAddress,
      erc20Contract,
      signer
    );

    let approval = await contract_final.approve(
      contractAddress,
      ethers.BigNumber.from(
        '115792089237316195423570985008687907853269984665640564039457584007913129639935'
      )
    );
    return approval;
  } catch (error) {
    console.log({ error });
  }
}

function getNonce() {
  if (signer && provider) {
    let baseNonce = provider.getTransactionCount(signer.getAddress());
    let nonceOffset = 0;
    return baseNonce.then((nonce) => nonce + nonceOffset++);
  }
}

async function depositEth() {
  let overrides = {
    value: parsedAmount,
    nonce: getNonce(),
  };

  try {
    let res = await stark_contract_final.depositEth(
      stark_key, // we have to pass
      stark_asset_id, // from BE POST  { coin: coin } as body
      vaultId, // form BE - /user/create_vault/
      overrides
    );
    console.log({ res }, 'depositEth');
  } catch (error) {
    console.log({ error });
  }
}

async function depositERC20() {
  // let amount = 0.000001 * 10 ** 18;
  try {
    let res = await stark_contract_final.depositERC20(
      stark_key,
      selectedData?.stark_asset_id,
      vaultId,
      quanitizatedAmount // quantize it with backend data field name as [quanitization]
    );
    console.log(
      { res, amount: dequantize(Number(res?.value), 18) },
      'depositERC20'
    );
  } catch (error) {
    console.log({ error });
  }
}

// after the sol call, you have to hitting the endpoint with res -> /payment/stark/start/ post method

async function getBalance() {
  let res = await signer.getBalance();
  console.log({ res: ethers.utils.formatEther(res) });
}

async function getBalanceERC20() {
  const contract = new ethers.Contract(tokenAddress, erc20Contract, provider);
  const balance = (await contract.balanceOf(userAddress)).toString();
  const normalBalance = balance / Math.pow(10, 18);
  console.log({ res: Number(normalBalance) });
}

// Call the function to get the output
// depositERC20();
// getBalanceERC20();
// approveUnlimitedAllowance();
