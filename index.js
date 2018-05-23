const path = require('path')

const chalk = require('chalk')
const log = console.log
const Promise = require('bluebird')

// const Deploy = require('./src/deploy')
const Service = require('./src/asch-service')
// const SendMoney = require('./src/sendMoney')

if (process.platform !== 'linux') {
  log(chalk.red('This program can currently run only on linux'))
}

let endProcess = function () {
  process.kill(process.pid, 'SIGINT')
}

// asch node
// new Service(defaultConfig.node.directory, logDir)
let aschService = function () {
  this.stop = function () {}
  this.start = function () {}
}

// https://www.exratione.com/2013/05/die-child-process-die/
process.on('SIGTERM', function () {
  // kill
  log(chalk.blue('SIGTERM'))
  aschService.stop()
  process.exit(0)
})
process.on('SIGINT', function () {
  // ctrl+c
  log(chalk.blue('SIGTERM'))
  aschService.stop()
  process.exit(0)
})
process.once('uncaughtException', function (error) {
  log(chalk.red('UNCAUGHT EXCEPTION'))
  log(error)
})

// config
let defaultConfig = {}
let IsConfigValid = require('./src/isConfigValid')
let config = new IsConfigValid()

// load configuration and review correctness
config.getConfig()
  .then((config) => {
    console.log('GOT CONFIG!!!')
    defaultConfig = config
    return null
  })
  .catch(function configNotValid (notValid) {
    endProcess()
  })
  .then(function checkFileStructure () { // checkFileStructure
    let CheckFileStructure = require('./src/fileStructureExists')
    let check = new CheckFileStructure(defaultConfig.userDevDir)
    return check.check()
  })
  .catch(function errorAfterConfigCheck (error) {
    log(chalk.yellow('The configuration is not valid:'), chalk.red(error.message))
    endProcess()
  })
  .then(function startAschNode () { // start asch node
    let logDir = path.join(__dirname, 'logs')
    aschService = new Service(defaultConfig.node.directory, logDir)
    aschService.notifier.on('exit', function (code) {
      console.log(`asch-node terminated with code ${code}`)
    })
    aschService.start()
  })

// let dep = new Deploy(defaultConfig)
// let money = new SendMoney(defaultConfig)

// Promise.delay(12000)
//   .then(function (result) {
//     return money.sendMoney()
//   })
//   .then(function sendMoneyFinished (response) {
//     return response
//   })
//   .then(function wait () {
//     return Promise.delay(10000)
//   })
//   .then(function () {
//     return dep.registerDapp()
//   })
//   .then(function registerDappFinished (response) {
//     if (response.status !== 200) {
//       throw new Error('Could not register dapp')
//     }
//     if (response.data.success === false) {
//       throw new Error(response.data.error)
//     }
//     dep.dappId = response.data.transactionId

//     log(chalk.green(`\nDAPP registered, DappId: ${response.data.transactionId}\n`))
//     return dep.copyFiles(response.data.transactionId)
//   })
//   .then(function wait (result) {
//     console.log(result)
//     return Promise.delay(10000)
//   })
//   .then(function (result) {
//     log(chalk.green('stopping asch-Server for restart'))
//     aschService.stop()
//     return Promise.delay(5000)
//   })
//   .then(function afterStopChangeAschConfig (result) {
//     log(chalk.green('asch-server stopped'))
//     return dep.changeAschConfig(result)
//   })
//   .then(function (result) {
//     console.log(result)
//     aschService.start()
//     return Promise.delay(5000)
//   })
//   .then(function restartResult () {
//     log(chalk.green('aschService started'))
//   })
//   .catch(function errorOccured (error) {
//     log(chalk.red('ERROR OCCURED'))
//     log(chalk.red(error))
//     log(chalk.red(error.message))
//   })

// test
setTimeout(() => {
  console.log('EXITING...')
}, 10000000)
