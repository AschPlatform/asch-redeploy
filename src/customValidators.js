const ZSchema = require('z-schema')
const Mnemonic = require('bitcore-mnemonic')
const fs = require('fs')

ZSchema.registerFormat('bip39', (secret) => {
  console.log(secret)
  return Mnemonic.isValid(secret)
})

// achtung type is nicht format!!!

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
