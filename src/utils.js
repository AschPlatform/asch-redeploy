const chalk = require('chalk')
const path = require('path')
let randomstring = require('randomstring')
let log = console.log

let endProcess = function () {
  log(chalk.yellow('SIGINT send'))
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
