/* needs to be called first */
const DI = require('./src/DI')

let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)

const utils = require('./src/utils')
const Promise = require('bluebird')
const logger = require('./src/logger')

// https://www.exratione.com/2013/05/die-child-process-die/
process.once('uncaughtException', function (error) {
  logger.error('UNCAUGHT EXCEPTION')
  logger.error(error.stack)
})

const Conductor = require('./src/orchestration/conductor')
let aschService = DI.container.get(DI.FILETYPES.Service)
let appConfig = DI.container.get(DI.DEPENDENCIES.Config)

aschService.notifier.on('exit', function (code) {
  logger.warn(`asch-node terminated with code ${code}`)
})
process.on('SIGTERM', function () {
  logger.verbose('SIGTERM', { meta: 'inverse' })
  aschService.stop()
  process.exit(0)
})
process.on('SIGINT', function () {
  // ctrl+c
  logger.verbose('SIGTERM', { meta: 'inverse' })
  aschService.stop()
  process.exit(0)
})

logger.verbose('starting asch-redeploy...')

startUpCheck.check()
  .then(() => {
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
    logger.verbose(err.stack)
    utils.endProcess()
  })
