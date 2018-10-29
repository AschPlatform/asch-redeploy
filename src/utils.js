const path = require('path')
const logger = require('./logger')
const Mnemonic = require('bitcore-mnemonic')
const bignumber = require('bignumber')

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

let trimPrecision = function (amount, precision) {
  if (Number(amount) === 0) return '0'

  const s = amount.toString()
  const value = bignumber(s)
  if (precision <= 10) {
    return value.div(10 ** precision).toString()
  }

  return value.div(10 ** 10).div(10 ** (precision - 10)).toString()
}

module.exports = {
  endProcess,
  getParentDirectory,
  generateRandomString,
  trimPrecision
}
