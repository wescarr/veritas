#! /usr/bin/env node
import { decrypt, encrypt } from './index'

const usage = () => {
  console.log(`
Usage:
  Command:
    veritas-env encrypt [options]
  
  Options:
    --input=<.env>            env file to encrypt
    --ouput=<encrypted.json>  file path to store encrypted contents

  Command:
    veritas-env decrypt --input=encrypted.json --ouput=.env.local

  Options:
    --input=<encrypted.json>  file to decrypt
    --output=<.env>           file path to store decrypted contents

`)
  process.exit(0)
}

const [, , command, ...args] = process.argv
if (args.length !== 2) {
  usage()
}

const options = Object.fromEntries(
  args.map((a) => {
    const [name, value] = a.split('=', 2)
    return [name.toLowerCase().replace(/^-+/, ''), value]
  })
)

const { input, output } = options
if (!(input && output)) {
  usage()
}

if (input === output) {
  throw new Error('input and output files should not be the same')
}

switch (command.toLowerCase()) {
  case 'encrypt':
    encrypt(input, output)
    break
  case 'decrypt':
    decrypt(input, output)
    break
  default:
    usage()
}
