#! /usr/bin/env node
import { decrypt, encrypt } from './index.js'

const usage = () => {
  console.log(`
Usage:
  Command:
    veritas encrypt [options]
  
  Options:
    --input=<.env>            env file to encrypt
    --ouput=<encrypted.json>  file path to store encrypted contents

  Command:
    veritas decrypt --input=encrypted.json --ouput=.env.local

  Options:
    --input=<encrypted.json>  file to decrypt
    --output=<.env>           file path to store decrypted contents

`)
  process.exit(0)
}

const [, , method, ...args] = process.argv
if (args.length !== 2) {
  usage()
}

const options = Object.fromEntries(
  args.map((a) => {
    const [name, value] = a.split('=', 2)
    return [name.replace(/^-+/, ''), value]
  })
)

const { input, output } = options
if (!(input && output)) {
  usage()
}

switch (method) {
  case 'encrypt':
    encrypt(input, output)
    break
  case 'decrypt':
    decrypt(input, output)
    break
  default:
    usage()
}
