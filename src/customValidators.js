const ZSchema = require('z-schema')
const Mnemonic = require('bitcore-mnemonic')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log

ZSchema.registerFormat('bip39', (secret) => {
  log(chalk.yellow(`validating: "${secret}"`))
  let isBip39 = false
  try {
    isBip39 = Mnemonic.isValid(secret)
  } catch (err) {
    log(chalk.red(`secret "${secret}" is not bip39 complient`))
    log(chalk.red(err.message))
    throw err
  }
  return isBip39
})

ZSchema.registerFormat('file', (path) => {
  console.log(path)
  return fs.existsSync(path)
})

let areNewFormatsRegistered = () => {
  var registeredFormats = ZSchema.getRegisteredFormats()
  return registeredFormats &&
    registeredFormats.indexOf('bip39') > -1 &&
    registeredFormats.indexOf('file') > -1
}

module.exports = {
  areNewFormatsRegistered
}
