const Promise = require('bluebird')
const writeOutput = require('./writeOutput')
const logger = require('../logger')

let workflow = (service, config) => {
  this.service = service
  this.config = config

  const DI = require('../container')

  logger.info('check balance...', { meta: 'green' })

  return Promise.delay(12000)
    .then(function (result) {
      let money = DI.container.get(DI.FILETYPES.SendMoney)
      return money.sendMoney()
    })
    .then(function wait () {
      logger.info('starting to register Dapp...', { meta: 'green' })
      return Promise.delay(10000)
    })
    .then(function () {
      let registerDapp = DI.container.get(DI.FILETYPES.RegisterDapp)
      return registerDapp.register()
    })
    .then(function startToCopyfiles (transactionId) {
      let deploy = DI.container.get(DI.FILETYPES.Deploy)
      return deploy.deploy(transactionId)
    })
    .then(function writeAschConfigFile (transactionId) {
      let changeAschConfig = DI.container.get(DI.FILETYPES.ChangeAschConfig)
      return changeAschConfig.add(transactionId)
    })
    .then(function writeOutputfile (result) {
      return writeOutput(config, undefined)
    })
    .then(function wait (result) {
      logger.info(`wrote dappId to: ${result}`)
      let ms = 10000
      logger.verbose(`wait for: ${ms}`)
      return Promise.delay(ms)
    })
    .then((result) => {
      logger.verbose('stopping asch-Server for restart', { meta: 'green.inverse' })
      this.service.stop()
      return Promise.delay(5000)
    })
    .then(function afterStopChangeAschConfig (result) {
      logger.verbose('asch-server stopped', { meta: 'green.inverse' })
      // return deploy.changeAschConfig(result)
      return Promise.delay(2000)
    })
    .then((result) => {
      logger.verbose(`result: ${result}`)
      this.service.start()
      return Promise.delay(5000)
    })
    .then(function restartResult () {
      logger.info('aschService started', { meta: 'green.inverse' })
    })
    .catch(function errorOccured (error) {
      logger.verbose('error in worklflow.js occured')
      logger.error('ERROR OCCURED')
      throw error
    })
}

module.exports = workflow
