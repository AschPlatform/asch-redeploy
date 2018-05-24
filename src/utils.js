const chalk = require('chalk')
let log = console.log

let endProcess = function () {
  log(chalk.yellow('SIGINT send'))
  process.kill(process.pid, 'SIGINT')
}

module.exports = endProcess
