
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

  this.refuel = (dappId) => {
    return new Promise((resolve, reject) => {
      if (typeof dappId !== 'string') {
        reject(new Error('dappId must be of type string'))
      }

      if (this.config.uia && this.config.uia.publisher && this.config.uia.asset) {
        this.transferCurrency = `${this.config.uia.publisher}.${this.config.uia.asset}`
      }

      let amount = 500 * 1e8
      let transaction = this.aschJS.transfer.createInTransfer(dappId, this.transferCurrency, amount, config.dapp.masterAccountPassword, config.dapp.masterAccountPassword2nd || undefined)

      let url = `${this.config.node.host}:${this.config.node.port}/peer/transactions`

      this.axios.post(url, {
        transaction: transaction
      }, {
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
