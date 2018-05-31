// load global container
require('./src/container')

const path = require('path')
const utils = require('./src/utils')
const Promise = require('bluebird')
const logger = require('./src/logger')

const startUp = require('./src/startup/startup')
const Service = require('./src/orchestration/service')
const Conductor = require('./src/orchestration/conductor')
let aschService = null
let appConfig = null

// https://www.exratione.com/2013/05/die-child-process-die/
process.once('uncaughtException', function (error) {
  logger.error('UNCAUGHT EXCEPTION')
  logger.error(error.stack)
})

logger.verbose('starting asch-redeploy...')
startUp()
  .then((config) => {
    appConfig = config
    return appConfig
  })
  .then((config) => {
    let logDir = path.join(config.userDevDir, 'logs')
    let aschDirectory = config.node.directory
    let port = config.node.port
    aschService = new Service(aschDirectory, logDir, port)
    aschService.notifier.on('exit', function (code) {
      logger.warn(`asch-node terminated with code ${code}`)
    })
    process.on('SIGTERM', function () {
      logger.warn('SIGTERM', { meta: 'inverse' })
      aschService.stop()
      process.exit(0)
    })
    process.on('SIGINT', function () {
      // ctrl+c
      logger.warn('SIGTERM', { meta: 'inverse' })
      aschService.stop()
      process.exit(0)
    })

    return aschService.start()
  })
  .then(() => {
    let ms = 7000
    logger.verbose(`waiting for ${ms}ms`)
    return Promise.delay(ms)
  })
  .then(() => {
    logger.verbose('starting to orchestrate...')
    let conductor = new Conductor(aschService, appConfig)
    return conductor.orchestrate()
  })
  .catch((err) => { // last error handler
    logger.error(err.message)
    logger.error(err.stack)
    utils.endProcess()
  })
