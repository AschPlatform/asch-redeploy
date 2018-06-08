/* needs to be called first */
const DI = require('./src/container')

let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)

const utils = require('./src/utils')
const Promise = require('bluebird')
const logger = require('./src/logger')

const Conductor = require('./src/orchestration/conductor')
let aschService = DI.container.get(DI.FILETYPES.Service)
let appConfig = DI.container.get(DI.DEPENDENCIES.Config)

// https://www.exratione.com/2013/05/die-child-process-die/
process.once('uncaughtException', function (error) {
  logger.error('UNCAUGHT EXCEPTION')
  logger.error(error.stack)
})

logger.verbose('starting asch-redeploy...')

startUpCheck.check()
  .then(() => {
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
