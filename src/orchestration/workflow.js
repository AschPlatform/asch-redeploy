const Promise = require('bluebird')
const log = console.log
const chalk = require('chalk')
const Deploy = require('./deploy')
const SendMoney = require('./sendMoney')

let workflow = (service, config) => {
  this.service = service
  this.config = config

  const deploy = new Deploy(config)
  const money = new SendMoney(config)

  return Promise.delay(12000)
    .then(function (result) {
      return money.sendMoney()
    })
    .then(function sendMoneyFinished (response) {
      return response
    })
    .then(function wait () {
      return Promise.delay(10000)
    })
    .then(function () {
      return deploy.registerDapp()
    })
    .then(function registerDappFinished (response) {
      if (response.status !== 200) {
        throw new Error('Could not register dapp')
      }
      if (response.data.success === false) {
        throw new Error(response.data.error)
      }
      deploy.dappId = response.data.transactionId

      log(chalk.green(`\nDAPP registered, DappId: ${response.data.transactionId}\n`))
      return deploy.copyFiles(response.data.transactionId)
    })
    .then(function wait (result) {
      console.log(result)
      return Promise.delay(10000)
    })
    .then((result) => {
      log(chalk.green('stopping asch-Server for restart'))
      this.service.stop()
      return Promise.delay(5000)
    })
    .then(function afterStopChangeAschConfig (result) {
      log(chalk.green('asch-server stopped'))
      return deploy.changeAschConfig(result)
    })
    .then((result) => {
      console.log(result)
      this.service.start()
      return Promise.delay(5000)
    })
    .then(function restartResult () {
      log(chalk.green('aschService started'))
    })
    .catch(function errorOccured (error) {
      log(chalk.red('ERROR OCCURED'))
      log(chalk.red(error))
      log(chalk.red(error.message))
    })
}

module.exports = workflow
