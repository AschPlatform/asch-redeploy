const path = require('path')
process.env['NODE_CONFIG_DIR'] = path.join(__dirname, 'config')
const chalk = require('chalk')
const log = console.log
const shelljs = require('shelljs')
const Promise = require('bluebird')

const Deploy = require('./src/deploy')
const Service = require('./src/asch-service')
const SendMoney = require('./src/sendMoney')

if (process.platform !== 'linux') {
  log(chalk.red('This program can currently run only on linux'))
}

// config
const config = require('config')
let userDevDir = shelljs.pwd().stdout
let defaultConfig = config.get('config')
defaultConfig.userDevDir = userDevDir

log(chalk.red(`userDevDir: ${userDevDir}`))

log(chalk.red(`You started "asch-redeploy" from directory "${userDevDir}"`))

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

let logDir = path.join(__dirname, 'logs')
let aschService = new Service(defaultConfig.node.directory, logDir)

// start asch node
aschService.start()

aschService.notifier.on('exit', function (code) {
  console.log(`asch-node terminated with code ${code}`)
})

let dep = new Deploy(defaultConfig)
let money = new SendMoney(defaultConfig)

Promise.delay(12000)
  .then(function (result) {
    return money.sendMoney()
  })
  .then(function sendMoneyFinished (response) {
    return response
  })
  .then(function wait () {
    return Promise.delay(10000)
  })
  .then(function () {
    return dep.registerDapp()
  })
  .then(function registerDappFinished (response) {
    if (response.status !== 200) {
      throw new Error('Could not register dapp')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    dep.dappId = response.data.transactionId

    log(chalk.green(`\nDAPP registered, DappId: ${response.data.transactionId}\n`))
    return dep.copyFiles(response.data.transactionId)
  })
  .then(function wait (result) {
    console.log(result)
    return Promise.delay(10000)
  })
  .then(function (result) {
    log(chalk.green('stopping asch-Server for restart'))
    aschService.stop()
    return Promise.delay(5000)
  })
  .then(function afterStopChangeAschConfig (result) {
    log(chalk.green('asch-server stopped'))
    return dep.changeAschConfig(result)
  })
  .then(function (result) {
    console.log(result)
    aschService.start()
    return Promise.delay(5000)
  })
  .then(function restartResult () {
    log(chalk.green('aschService started'))
  })
  .catch(function errorOccured (error) {
    log(chalk.red('ERROR OCCURED'))
    log(chalk.red(error))
    log(chalk.red(error.message))
  })
