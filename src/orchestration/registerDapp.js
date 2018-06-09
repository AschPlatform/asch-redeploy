
// ctor
let RegisterDapp = function (config, dappConfig, utils, axios, aschJS, logger) {
  this.config = config
  this.dappConfig = dappConfig
  this.utils = utils
  this.axios = axios
  this.aschJS = aschJS
  this.logger = logger

  this.peerTransactionUrl = `${config.node.host}:${config.node.port}/peer/transactions`
  this.header = {
    magic: this.config.node.magic,
    version: ''
  }

  this.register = () => {
    let secret = this.config.dapp.masterAccountPassword
    let secondSecret = this.config.dapp.masterAccountPassword2nd

    var dapp = JSON.parse(JSON.stringify(this.dappConfig))
    dapp.name = `${dapp.name}-${utils.generateRandomString(15)}`
    dapp.link = `${dapp.link.replace('.zip', '')}-${utils.generateRandomString(15)}.zip`
    this.logger.info(`dapp: ${JSON.stringify(dapp, null, 2)}`)

    let trs = aschJS.dapp.createDApp(dapp, secret, secondSecret)
    return this.axios.post(this.peerTransactionUrl, { transaction: trs }, {
      headers: this.header
    })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Could not register dapp')
        }
        if (response.data.success === false) {
          this.logger.warn(`registration of dapp was not successful ${JSON.stringify(response.data)}`)
          throw new Error(response.data)
        }
        this.logger.info(`DAPP registered, DappId: ${response.data.transactionId}`, { meta: 'green.inverse' })

        return response.data.transactionId
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = RegisterDapp
