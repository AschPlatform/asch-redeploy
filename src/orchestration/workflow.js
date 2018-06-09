const Promise = require('bluebird')
const logger = require('../logger')
const DI = require('../container')

let workflow = (service, config) => {
  this.service = service
  this.config = config

  logger.info('check balance...', { meta: 'green' })

  return Promise.delay(12000)
    .then(function (result) {
      let money = DI.container.get(DI.FILETYPES.SendMoney)
      return money.sendMoney()
    })
    .then(function wait () {
      logger.info('starting to register Dapp...', { meta: 'green' })
      return Promise.delay(12000)
    })
    .then(function () {
      let registerDapp = DI.container.get(DI.FILETYPES.RegisterDapp)
      return registerDapp.register()
    })
    .then(function serializeNewDappId (transactionId) {
      let serializeNewDapp = DI.container.get(DI.FILETYPES.SerializedNewDappId)
      let result = serializeNewDapp.serializeSync(transactionId)
      if (result === true) {
        logger.info(`wrote dappId to: ${result}`)
      }
      return transactionId
    })
    .then(function startToCopyfiles (transactionId) {
      let deploy = DI.container.get(DI.FILETYPES.Deploy)
      return deploy.deploy(transactionId)
    })
    .then(function writeAschConfigFile (transactionId) {
      let changeAschConfig = DI.container.get(DI.FILETYPES.ChangeAschConfig)
      return changeAschConfig.add(transactionId)
    })
    .then(function wait (result) {
      let ms = 10000
      logger.verbose(`wait for: ${ms}`)
      return Promise.delay(ms)
    })
    .then((result) => {
      logger.verbose('stopping asch-Server for restart', { meta: 'green.inverse' })
      return this.service.stop()
    })
    .then((result) => {
      logger.verbose('stopping asch-server', { meta: 'green.inverse' })
      return Promise.delay(5000)
    })
    .then(() => {
      logger.info('starting aschService', { meta: 'green.inverse' })
      return this.service.start()
    })
    .then(() => {
      return Promise.delay(5000)
    })
    .catch(function errorOccured (error) {
      logger.verbose('error in worklflow.js occured')
      logger.error('ERROR OCCURED')
      throw error
    })
}

module.exports = workflow
