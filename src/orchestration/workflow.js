const Promise = require('bluebird')
const logger = require('../logger')
const DI = require('../DI')

let workflow = (service, config) => {
  this.service = service
  this.config = config

  this._registered = []

  logger.info('check balance...', { meta: 'green' })

  return Promise.delay(11000)
    .then(function (result) {
      let money = DI.container.get(DI.FILETYPES.SendMoney)
      return money.sendMoney()
    })
    .then(function () {
      let uia = DI.container.get(DI.FILETYPES.UIA)
      return uia.start()
    })
    .then(function wait () {
      logger.info('starting to register Dapp...', { meta: 'green' })
      return Promise.delay(100)
    })
    .then(() => {
      let registerDapp = DI.container.get(DI.FILETYPES.RegisterDapp)
      return registerDapp.register()
    })
    .then ((registeredTrans) => {
      this._registered[registeredTrans.trs] = registeredTrans.name
      return registeredTrans.trs
    })
    .then((transactionId) => {
      return Promise.delay(1000)
        .then(function serializeNewDappId () {
          let serializeNewDapp = DI.container.get(DI.FILETYPES.SerializedNewDappId)
          let result = serializeNewDapp.serializeSync(transactionId)
          if (result === true) {
            logger.info(`wrote dappId to: ${result}`)
          }
          return transactionId
        })
        .then((transactionId) => {
          let deploy = DI.container.get(DI.FILETYPES.Deploy)
          return deploy.deploy(transactionId, this._registered[transactionId])
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
          logger.info('starting asch node', { meta: 'green.inverse' })
          return this.service.start()
        })
        .then(() => {
          // TODO: Check if blockchain is ready
          return Promise.delay(20000)
        })
        .then(() => {
          logger.info('blockchain started', { meta: 'blue.inverse' })
          let refuelDapp = DI.container.get(DI.FILETYPES.RefuelDapp)
          return refuelDapp.refuel(this._registered[transactionId])
        })
        .then(() => {
          return Promise.delay(8000)
        })
    })
    .catch(function errorOccured (error) {
      logger.verbose('error in worklflow.js occured')
      logger.error('ERROR OCCURED')
      throw error
    })
}

module.exports = workflow
