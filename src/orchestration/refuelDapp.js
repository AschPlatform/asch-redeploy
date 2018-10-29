
let RefuelDapp = function (config, axios, aschJS, logger) {
  this.config = config
  this.axios = axios
  this.aschJS = aschJS
  this.logger = logger

  this.transferCurrency = 'XAS'

  this.headers = {
    magic: this.config.node.magic,
    version: ''
  }

  this.refuelDapp = (dappName, currency, precision) => {
    if (typeof dappName !== 'string') {
      throw new Error('dappName must be of type string')
    }
    if (!currency) {
      throw new Error('currency must be provided for DApp refuel')
    }
    if (!precision) {
      throw new Error('precision must be provided for DApp refuel')
    }

    let secret = this.config.dapp.masterAccountPassword
    let secondSecret = this.config.dapp.masterAccountPassword2nd

    let publicKey = this.aschJS.crypto.getKeys(secret).publicKey
    let senderId = this.aschJS.crypto.getAddress(publicKey)

    let realAmount = 500
    let amount = realAmount * (10 ** precision)

    let trs = {
      secret: secret,
      secondSecret: secondSecret,
      fee: 0.1 * 1e8,
      type: 204,
      senderId: senderId,
      args: [
        dappName, currency, amount
      ]
    }

    this.logger.info(`DAPP refuel with ${realAmount} ${currency} (${amount} ${currency})`)
    let url = `${this.config.node.host}:${this.config.node.port}/api/transactions`

    return this.axios.put(url, trs, {
      headers: this.headers
    })
  }

  this.handleRefuel = (response) => {
    if (response.status !== 200) {
      throw new Error('Could not refuel dapp')
    }
    if (response.data.success === false) {
      this.logger.warn(`dapp refuel was not successful ${JSON.stringify(response.data)}`)
      throw new Error(JSON.stringify(response.data))
    }

    return true
  }

  this.start = (dappName) => {
    return this.refuelDapp(dappName, 'XAS', 8)
      .then((result) => this.handleRefuel(result))
      .then(() => {
        if (this.config.uia && this.config.uia.publisher && this.config.uia.asset) {
          let currency = `${this.config.uia.publisher}.${this.config.uia.asset}`
          let precision = this.config.uia.precision
          return this.refuelDapp(dappName, currency, precision)
        } else {
          throw new Error('no_asset')
        }
      })
      .then((result) => this.handleRefuel(result))
      .catch((error) => {
        if (error.message.startsWith('no_asset')) {
          return true
        } else {
          throw error
        }
      })
  }
}

module.exports = RefuelDapp
