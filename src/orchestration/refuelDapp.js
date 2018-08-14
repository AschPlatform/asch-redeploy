
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

  this.refuel = (dappName) => {
    return new Promise((resolve, reject) => {
      if (typeof dappName !== 'string') {
        reject(new Error('dappId must be of type string'))
      }

      if (this.config.uia && this.config.uia.publisher && this.config.uia.asset) {
        this.transferCurrency = `${this.config.uia.publisher}.${this.config.uia.asset}`
      }

      let secret = this.config.dapp.masterAccountPassword

      let publicKey = this.aschJS.crypto.getKeys(secret).publicKey
      let senderId = this.aschJS.crypto.getAddress(publicKey)

      let amount = 500 * 1e8
      let trs = {
        secret: secret,
        fee: 0.1 * 1e8,
        type: 204,
        senderId: senderId,
        args: [
          dappName, this.transferCurrency, amount
        ]
      }

      this.logger.info(`refuel: \n ${JSON.stringify(trs, null, 2)}`)

      let url = `${this.config.node.host}:${this.config.node.port}/api/transactions`

      this.axios.put(url, trs, {
        headers: this.headers
      })
        .then((response) => {
          if (response.status !== 200) {
            throw new Error('Could not register dapp')
          }
          if (response.data.success === false) {
            this.logger.warn(`dapp refuel was not successful ${JSON.stringify(response.data)}`)
            throw new Error(response.data)
          }
          this.logger.info(`DAPP refuel with ${amount / 1e8} ${this.transferCurrency}, transactionId: "${response.data.transactionId}"`)
          resolve(response.data.transactionId)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }
}

module.exports = RefuelDapp
