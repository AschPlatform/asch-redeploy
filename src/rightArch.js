const chalk = require('chalk')
const utils = require('./utils')
let log = console.log

let rightFunction = () => {
  if (process.platform !== 'linux') {
    log(chalk.red('This program can currently run only on linux'))
    utils.endProcess()
  }
}

module.exports = rightFunction
