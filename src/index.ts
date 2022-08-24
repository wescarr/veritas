import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const {
  VERITAS_SECRET,
  VERITAS_ENCRYPTION_ALGORITHM = 'aes256',
  VERITAS_SALT,
  VERITAS_SALT_KEY_LENGTH = '32',
  VERITAS_IV,
  VERITAS_IV_LENGTH = '16',
} = process.env

if (!VERITAS_SECRET) {
  throw new Error('Missing required envrionment variable "VERITAS_SECRET"')
}

if (!VERITAS_SALT) {
  throw new Error('Missing required envrionment variable "VERITAS_SALT"')
}

const encoding = 'base64'
const ivLength = parseInt(VERITAS_IV_LENGTH, 10)

const key = crypto.scryptSync(
  VERITAS_SECRET,
  VERITAS_SALT,
  parseInt(VERITAS_SALT_KEY_LENGTH, 10)
)

const readJsonFile = (file: string) =>
  JSON.parse(fs.readFileSync(file, { encoding: 'utf8' })) as Record<
    string,
    string
  >

const getIv = () =>
  VERITAS_IV
    ? Buffer.from(VERITAS_IV, 'utf8').slice(0, ivLength)
    : crypto.randomBytes(ivLength)

export const decrypt = (file: string, destination: string) => {
  const vars = readJsonFile(file)

  for (const name in vars) {
    const data = Buffer.from(vars[name], encoding)
    const iv = data.subarray(0, ivLength)
    const ciphertext = Buffer.from(
      vars[name].slice(iv.toString(encoding).length),
      encoding
    )

    const decipher = crypto.createDecipheriv(
      VERITAS_ENCRYPTION_ALGORITHM,
      key,
      iv
    )
    let decrypted = decipher.update(ciphertext, undefined, 'utf8')
    decrypted += decipher.final('utf8')

    vars[name] = decrypted
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(
    destination,
    Object.entries(vars)
      .map((e) => `${e[0]}=${e[1]}`)
      .join('\n')
  )

  return vars
}

export const encrypt = (envFile: string, destination: string) => {
  const envData = fs.readFileSync(envFile, { encoding: 'utf-8' })
  const vars = Object.fromEntries(
    envData
      .split('\n')
      .filter((e) => e.indexOf('=') > 0)
      .map((e) => e.split('='))
  )

  // merge with destination
  let existing = {}
  if (fs.existsSync(destination)) {
    existing = readJsonFile(destination)
  }

  // Encrypt each value
  for (const name in vars) {
    const iv = getIv()

    const cipher = crypto.createCipheriv(VERITAS_ENCRYPTION_ALGORITHM, key, iv)
    let encrypted = iv.toString(encoding)
    encrypted += cipher.update(vars[name], 'utf8', encoding)
    encrypted += cipher.final(encoding)

    existing[name] = encrypted
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.writeFileSync(destination, JSON.stringify(existing, null, 2))
}
