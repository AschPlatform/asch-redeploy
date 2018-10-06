const path = require('path')
const logger = require('./logger')
const Mnemonic = require('bitcore-mnemonic')

let endProcess = function () {
  logger.verbose('SIGINT send', { meta: 'blue.inverse' })
  process.kill(process.pid, 'SIGINT')
}

let getParentDirectory = function (directory) {
  let split = directory.split(path.sep)
  return split.slice(0, (split.length - 1)).join(path.sep)
}

let generateRandomString = function (howManyWords) {
  if (howManyWords > 12) {
    howManyWords = 12
  }

  let secret = new Mnemonic(Mnemonic.Words.ENGLISH).toString()
  let joined = secret.split(' ').slice(0, howManyWords).join('-')
  return joined
}

module.exports = {
  endProcess,
  getParentDirectory,
  generateRandomString
}
