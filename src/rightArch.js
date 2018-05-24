const chalk = require('chalk')
const { endProcess } = require('./utils')
let log = console.log

let rightFunction = () => {
  if (process.platform !== 'linux') {
    log(chalk.red('This program can currently run only on linux'))
    endProcess()
  }
}

module.exports = rightFunction
