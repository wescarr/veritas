[![npm version](https://badge.fury.io/js/veritas-env.svg)](https://www.npmjs.com/veritas-env)

# veritas

Encrypted environment variables for node done right.

## Install

```bash
npm install -g veritas-env
```

## Configure

Veritas supports the following options via environment variables

### Required

- `VERITAS_SECRET`: The secret used to encrypt each environment variable.
- `VERITAS_SALT` The salt to use during encryption.

### Optional

- `VERITAS_ENCRYPTION_ALGORITHM`: Encryption algorithm to use. **Default:** `aes256`
- `VERITAS_SALT_KEY_LENGTH`: Salt length (bytes). This must match the requirements of the selected encryption algorithm. **Default:** `32`
- `VERITAS_IV`: User provided Initialization Vector string. See below.
- `VERITAS_IV_LENGTH`: Initialization Vector length (bytes). **Default:** `16`

By default, a random Initialization Vector is used each time a variable is encrypted. While technically more secure, it has the down side of changing all the values in the output JSON file each time they are encrypted, meaning that if you update just one variable, a `git diff` will show all variables as being changed. You can change this behavior by providing your own IV via `VERITAS_IV`.

## Usage

To encrypt an existing `.env` file

```bash
$ npx veritas encrypt --input=.env --output=./path/to/encrypted.json
```

To decrypt an existing file encrypted by veritas

```bash
$ npx veritas decrypt --input=./path/to/encrypted.json --output=.env
```

**Tip:** Use something like [direnv](https://direnv.net) to automatically expose your secrets when running the above commands.

## Motivation

- ### Diffs

  The problem similar libaries have is that they encrypt the entire contents of a file, making it opaque to diffing. It can be quite a cumbersome process to merge changes from another branch that updates an encrypted file that your branch has also modified. Multiple this by the number of environments you have, and ... I feel your pain.

- ### Vercel

  While I love Vercel and use it for numerous projects, it has the unfortunate limit of only allowing a total of `4KB` for environment variables. Use something like a credentials JSON file to work with Google libraries, and you've pretty much blown your entire budget.

  Here's how you can configure your `next.config.js` to work with Veritas.

  ```js
  const { decrypt } = require('veritas-env')

  const env = decrypt(`./config/${process.env.ENV_FILE}.json`, '.env')

  module.exports = { env }
  ```

  Then configure your secrets and `ENV_FILE` in Vercel's envrionment variables for the `Preview` and `Production` environments and you're all set. Damn that wasy easy!
