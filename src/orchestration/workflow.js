const Promise = require('bluebird')
const Deploy = require('./deploy')
const writeOutput = require('./writeOutput')
const logger = require('../logger')

let workflow = (service, config) => {
  this.service = service
  this.config = config

  const deploy = new Deploy(config)
  const DI = require('../container')

  logger.info('check balance...', { meta: 'green' })

  return Promise.delay(12000)
    .then(function (result) {
      let money = DI.container.get(DI.FILETYPES.SendMoney)
      return money.sendMoney()
    })
    .then(function sendMoneyFinished (response) {
      return response
    })
    .then(function wait () {
      logger.info('starting to register Dapp...', { meta: 'green' })
      return Promise.delay(10000)
    })
    .then(function () {
      let registerDapp = DI.container.get(DI.FILETYPES.RegisterDapp)
      return registerDapp.register()
    })
    .then(function registerDappFinished (response) {
      if (response.status !== 200) {
        throw new Error('Could not register dapp')
      }
      if (response.data.success === false) {
        throw new Error(response.data.error)
      }
      deploy.dappId = response.data.transactionId

      logger.info(`DAPP registered, DappId: ${response.data.transactionId}`, { meta: 'green.inverse' })
      return deploy.copyFiles(response.data.transactionId)
    })
    .then(function writeOutputfile (result) {
      return writeOutput(config, deploy.dappId)
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
      return deploy.changeAschConfig(result)
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
