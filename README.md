# veritas

Encrypted environment variables for node done right.

## Install

```bash
npm install -g veritas-env
```

## Configure

Veritas supports the following options via environment variables

```
VERITAS_SECRET (The secret used to encrypt each environment variable)
VERITAS_ENCRYPTION_ALGORITHM=aes256 (Encryption algorithm to use)
VERITAS_SALT (The salt to use during encryption)
VERITAS_SALT_KEY_LENGTH=32 (Salt bytes length. This must match the requirements of the selected encryption algorithm)
VERITAS_IV (User provided IV string)
VERITAS_IV_LENGTH=16 (IV bytes length)
VERITAS_USE_RANDOM_IV=false (Whether or not to use a random IV)
```

## Usage

To encrypt an existing `.env` file

```bash
$ npx veritas encrypt --input=.env --output=./path/to/encrypted.json
```

To decrypt an existing file encrypted by veritas

```bash
$ npx veritas decrypt --input=./path/to/encrypted.json --output=.env
```
