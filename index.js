const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const chalk = require('chalk')
const log = console.log


const deploy = require('./src/deploy')
const service = require('./src/asch-service')

if (process.platform !== 'linux') {
  log(chalk.red('This program can currently run only on linux'))
}


// config
const config = require('config')
let userDevDir = __dirname
let defaultConfig = config.get('config')
defaultConfig.userDevDir = userDevDir

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
process.once("uncaughtException", function (error) {
  log(chalk.red('UNCAUGHT EXCEPTION'))
  log(error)
})


let aschService = new service(defaultConfig.node.directory)

// start asch node
aschService.start()

aschService.notifier.on('exit', function (code){
  console.log(`aschService terminated with code ${code}`)
  process.exit(code)
})

let dep = new deploy(defaultConfig)

dep.sendMoney()
  .then(function sendMoneyFinished(response) {
    if (response.status !== 200) {
      Promise.reject('Could not send money')
    }
    if (response.data.success === false) {
      Promise.reject(response.data.error)
    }
    log(chalk.green(`successful created money transaction: ${response.data.transactionId}`))
    return null
  })
  .then(function timeOutAfterMoneyTransfer() {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        resolve(dep.registerDapp())
      }, 10000)
    })
  })
  .then(function registerDappFinished(response) {
    if (response.status !== 200) {
      throw new Error('Could not register dapp')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    log(chalk.green(`\nDAPP registered, DappId: ${response.data.transactionId}\n`))
    return dep.copyFiles(response.data.transactionId)
  })
  .then(function copyingFilesFinished(result) {
    console.log(result)
    aschService.stop()
    return new Promise(function (resolve, reject) {
      setTimeout(function timeout() {
        resolve('aschService stopped')
      }, 5000)
    })
  })
  .then(function aschServerStoppedFinished(result){
    console.log(result)
    aschService.start()
    return new Promise(function (resolve, reject) {
      setTimeout(function timeout() {
        resolve('aschService started')
      }, 5000)
    })
  })
  .then (function restartResult(result) {
    log(chalk.green(result))
  })
  .catch(function errorOccured(error) {
    log(chalk.red('ERROR OCCURED'))
    log(chalk.red(error.message))
  })
