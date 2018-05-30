const path = require('path')
const randomstring = require('randomstring')
const logger = require('./logger')

let endProcess = function () {
  logger.info('SIGINT send', { meta: 'blue.inverse' })
  process.kill(process.pid, 'SIGINT')
}

let getParentDirectory = function (directory) {
  let split = directory.split(path.sep)
  return split.slice(0, (split.length - 1)).join(path.sep)
}

let generateRandomString = function (length) {
  var newRandom = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  })
  return newRandom
}

module.exports = {
  endProcess,
  getParentDirectory,
  generateRandomString
}
