class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
    this.message = message
  }
}

class CoinNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'CoinNotFoundError'
    this.message = message
  }
}

class InvalidAmountError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidAmountError'
    this.message = message
  }
}

class AllowanceTooLowError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AllowanceTooLowError'
    this.message = message
  }
}

class BalanceTooLowError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BalanceTooLowError'
    this.message = message
  }
}

const isAuthenticationError = (err: unknown): err is AuthenticationError => {
  return (<AuthenticationError>err).name === 'AuthenticationError'
}

export default {
  AuthenticationError,
  isAuthenticationError,
  CoinNotFoundError,
  AllowanceTooLowError,
  BalanceTooLowError,
  InvalidAmountError,
}

export {
  AuthenticationError,
  isAuthenticationError,
  CoinNotFoundError,
  AllowanceTooLowError,
  BalanceTooLowError,
  InvalidAmountError,
}
