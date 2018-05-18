const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const config = require('config')
const chalk = require('chalk')
const log = console.log

const watch = require('node-watch')
const deploy = require('./src/deploy')
const service = require('./src/asch-service')


process.on('SIGTERM', function () {
  log(chalk.blue('SIGTERM'))
  aschService.execute('stop')
  .then(function (result) {
    log(chalk.green(result))
    process.exit()
  })
})
process.on('SIGINT', function () {
  log(chalk.blue('SIGTERM'))
  aschService.execute('stop')
    .then(function (result) {
      log(chalk.green(result))
      process.exit()
    })
})

// config
let executionDir = __dirname
let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir


let aschService = new service(defaultConfig.asch)


console.log(chalk.yellow(`asch-redploy is executed "${executionDir}"`))

watch(executionDir, { recursive: true }, function (evt, name) {
  log(chalk.yellow(`changed: ${name}`))
})


log(chalk.yellow(`Starting asch-node in ${defaultConfig.asch}`))

let dep = new deploy(defaultConfig)

aschService.execute('stop')
  .then(function stopServer(result) {
    log(chalk.red(result))
    return aschService.execute('start')
  })
  .then(function startServer(result) {
    log(chalk.green(result))
    return dep.sendMoney()
  })
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
    return aschService.execute('restart')
  })
  .then (function restartResult(result) {
    log(chalk.green(result))
  })
  .catch(function errorOccured(error) {
    log(chalk.red('ERROR OCCURED'))
    log(chalk.red(error.message))
  })
