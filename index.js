const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const config = require('config')
const shelljs = require('shelljs')
const chalk = require('chalk')
const log = console.log

const watch = require('node-watch')
const deploy = require('./src/deploy')
const aschService = require('./src/asch-service')


process.on('SIGTERM', function () {
  console.log('Trying to shut down asch-redeploy...')
  console.log(asch.status())
  proccess.exit()
})
process.on('SIGINT', function () {
  console.log('Trying to shut down asch-redeploy...')
  console.log(asch.stop())
  process.exit()
})



// config
let executionDir = shelljs.pwd().stdout
let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir

console.log(`asch-redploy is executed "${executionDir}"`)

watch(executionDir, { recursive: true }, function (evt, name) {
  log(chalk.yellow(`changed: ${name}`))
})

let asch = new aschService(defaultConfig.asch)
log(chalk.yellow(`Starting asch-node in ${defaultConfig.asch}`))

let dep = new deploy(defaultConfig)

asch.execute('stop')
  .then(function stopServer(result) {
    log(chalk.red(result))
    return asch.execute('start')
  })
  .then(function startServer(result) {
    log(chalk.green(result))

    return dep.sendMoney()
  })
  .then(function sendMoneyFinished(response) {
    if (response.status !== 200) {
      throw new Error('Could not send money')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    log(chalk.green(`successful created money transaction: ${response.data.transactionId}`))
    return dep.registerDapp()
  })
  .then(function registerDappFinished(response) {
    if (response.status !== 200) {
      throw new Error('Could not register dapp')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    console.log(`DAPP registered, DappId: ${response.data.transactionId}\n`)
    return dep.copyFiles(response.data.transactionId)
  })
  .then(function copyingFilesFinished(result) {

    return asch.restart()
  })
  .then (function restartResult(result) {
    log(chalk.green(result))
  })
  .catch(function errorOccured(error) {
    log(chalk.red('ERROR OCCURED'))
    log(chalk.red(error.message))
  })
