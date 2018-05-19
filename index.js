const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const chalk = require('chalk')
const log = console.log


const deploy = require('./src/deploy')
const service = require('./src/asch-service')


// https://www.exratione.com/2013/05/die-child-process-die/
process.on('SIGTERM', function () {
  // kill
  log(chalk.blue('SIGTERM'))
  aschService.execute('stop')
  .then(function (result) {
    log(chalk.blue(result))
    process.exit(0)
  })
})
process.on('SIGINT', function () {
  // ctrl+c
  log(chalk.blue('SIGTERM'))
  aschService.execute('stop')
    .then(function (result) {
      log(chalk.blue(result))
      process.exit(0)
    })
})
process.once("uncaughtException", function (error) {
  log(chalk.red('UNCAUGHT EXCEPTION'))
  log(error)
})


// config
const config = require('config')
let userDevDir = __dirname
let defaultConfig = config.get('config')
defaultConfig.userDevDir = userDevDir

log(chalk.red(`You started "asch-redeploy" from directory "${userDevDir}"`))

let aschService = new service(defaultConfig.node.directory)

aschService.start()

aschService.notifier.on('exit', function (code){
  console.log(`aschService terminated with code ${code}`)
})

setTimeout(function () {
  log(chalk.red('CALLING STOP'))
  aschService.stop()
}, 5000)

// let dep = new deploy(defaultConfig)


for (let i = 0; i < 1e10; ++i) {}


  // .then(function startServer(result) {
  //   log(chalk.green(result))
  //   return dep.sendMoney()
  // })
  // .then(function sendMoneyFinished(response) {
  //   if (response.status !== 200) {
  //     Promise.reject('Could not send money')
  //   }
  //   if (response.data.success === false) {
  //     Promise.reject(response.data.error)
  //   }
  //   log(chalk.green(`successful created money transaction: ${response.data.transactionId}`))
  //   return null
  // })
  // .then(function timeOutAfterMoneyTransfer() {
  //   return new Promise(function (resolve, reject) {
  //     setTimeout(function () {
  //       resolve(dep.registerDapp())
  //     }, 10000)
  //   })
  // })
  // .then(function registerDappFinished(response) {
  //   if (response.status !== 200) {
  //     throw new Error('Could not register dapp')
  //   }
  //   if (response.data.success === false) {
  //     throw new Error(response.data.error)
  //   }
  //   log(chalk.green(`\nDAPP registered, DappId: ${response.data.transactionId}\n`))
  //   return dep.copyFiles(response.data.transactionId)
  // })
  // .then(function copyingFilesFinished(result) {
  //   return aschService.execute('restart')
  // })
  // .then (function restartResult(result) {
  //   log(chalk.green(result))
  // })
  // .catch(function errorOccured(error) {
  //   log(chalk.red('ERROR OCCURED'))
  //   log(chalk.red(error.message))
  // })
