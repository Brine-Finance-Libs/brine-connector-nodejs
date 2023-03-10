class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthenticationError'
    this.message = message
  }
}

const isAuthenticationError = (err: unknown): err is AuthenticationError => {
  return (<AuthenticationError>err).name === 'AuthenticationError'
}

export default {
  AuthenticationError,
  isAuthenticationError,
}

export { AuthenticationError, isAuthenticationError }
