
// ctor
let RegisterDapp = function (config, utils, axios, aschJS, logger) {
  this.config = config
  this.utils = utils
  this.axios = axios
  this.aschJS = aschJS
  this.logger = logger

  this.peerTransactionUrl = `${config.node.host}:${config.node.port}/api/transactions`
  this.header = {
    magic: this.config.node.magic,
    version: ''
  }

  this.dappName = undefined

  this.register = () => {
    let secret = this.config.dapp.masterAccountPassword
    let secondSecret = this.config.dapp.masterAccountPassword2nd

    var dapp = {}
    dapp.name = `asch-${utils.generateRandomString(15)}`
    dapp.desc = dapp.name
    dapp.link = `http://${utils.generateRandomString(15)}.zip`
    dapp.icon = 'http://o7dyh3w0x.bkt.clouddn.com/hello.png'
    dapp.unlockDelegates = 3

    let publicKey = this.aschJS.crypto.getKeys(secret).publicKey
    let senderId = this.aschJS.crypto.getAddress(publicKey)

    this.dappName = dapp.name

    dapp.delegates = []
    let configDelegates = this.config.dapp.delegates.map((delegate) => {
      return this.aschJS.crypto.getKeys(delegate).publicKey
    })
    dapp.delegates = configDelegates
    this.logger.info(`dapp: ${JSON.stringify(dapp, null, 2)}`)

    let trs = {
      secret: secret,
      secondSecret: secondSecret,
      fee: 100 * 1e8,
      type: 200,
      args: [
        dapp.name,
        dapp.desc,
        dapp.link,
        dapp.icon,
        dapp.delegates,
        dapp.unlockDelegates
      ],
      senderId: senderId
    }

    return this.axios.put(this.peerTransactionUrl, trs, {
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
        this.logger.info(`DAPP name: ${this.dappName}`, { meta: 'white.inverse' })
        return {
          trs: response.data.transactionId,
          name: this.dappName
        }
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = RegisterDapp
