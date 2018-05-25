// process.env['NODE_ENV'] = 'development'

const path = require('path')
const utils = require('./src/utils')
const Promise = require('bluebird')

// https://www.npmjs.com/package/is-port-available

const chalk = require('chalk')
const log = console.log

const startUp = require('./src/startup/startup')
const Service = require('./src/service')
const Conductor = require('./src/conductor')
let aschService = null
let appConfig = null

// https://www.exratione.com/2013/05/die-child-process-die/
process.once('uncaughtException', function (error) {
  log(chalk.red('UNCAUGHT EXCEPTION'))
  log(error)
})

startUp()
  .then((config) => {
    appConfig = config
    return appConfig.node.directory
  })
  .then((aschDirectory) => {
    let logDir = path.join(__dirname, 'logs')
    aschService = new Service(aschDirectory, logDir)
    aschService.notifier.on('exit', function (code) {
      console.log(`asch-node terminated with code ${code}`)
    })
    process.on('SIGTERM', function () {
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

    return aschService.start()
  })
  .then(() => {
    return Promise.delay(7000)
  })
  .then(() => {
    let conductor = new Conductor(aschService, appConfig)
    return conductor.orchestrate()
  })
  .catch((err) => { // last error handler
    console.log(err)
    utils.endProcess()
  })
