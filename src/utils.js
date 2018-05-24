const chalk = require('chalk')
const path = require('path')
let log = console.log

let endProcess = function () {
  log(chalk.yellow('SIGINT send'))
  process.kill(process.pid, 'SIGINT')
}

let getParentDirectory = function (directory) {
  let split = directory.split(path.sep)
  return split.slice(0, (split.length - 1)).join(path.sep)
}

module.exports = {
  endProcess,
  getParentDirectory
}
