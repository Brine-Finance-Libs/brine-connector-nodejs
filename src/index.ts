import { Client } from './bin/client'
import * as dotenv from 'dotenv'
import { Response } from './types'
dotenv.config()

const main = async () => {
  const client = new Client()

  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS

  if (privateKey && ethAddress) {
    try {
      const loginRes = await client.login(ethAddress, privateKey)
      console.log(loginRes.message)

      const profileRes = await client.getProfileInfo()
      console.log(profileRes.payload)

    } catch (e) {
      console.log(e as Response<string>)
    }
  }
}

main()
