
// ctor
let CreateTokens = function (config, aschJS, axios, logger, promise) {
  this.config = config
  this.aschJS = aschJS
  this.axios = axios
  this.logger = logger
  this.promise = promise

  this.waitingMS = 11000

  this.getAssetBalance = () => {
    let publicKey = this.aschJS.crypto.getKeys(this.config.dapp.masterAccountPassword).publicKey
    let address = this.aschJS.crypto.getAddress(publicKey)
    let currency = `${this.config.uia.publisher}.${this.config.uia.asset}`
    let url = `${this.config.node.host}:${this.config.node.port}/api/uia/balances/${address}/${currency}`

    return this.axios.get(url)
  }

  this.processAssetBalance = (response) => {
    /* 0 balance: {
      "success": false,
      "error":"Balance info not found"
    }
    hasPositiveBalance: {
      "success": true,
      "balance": {
        "currency": "CCTime.XCT",
        "balance": "2000000000000",
        "maximum": "1000000000000000000",
        "precision": 8,
        "quantity": "2000000000000",
        "writeoff": 0,
        "allowWriteoff": 0,
        "allowWhitelist": 0,
        "allowBlacklist": 0,
        "maximumShow": "10000000000",
        "quantityShow": "20000",
        "balanceShow": "20000"
      }
    }
    */

    if (response.status === 200) {
      if (response.data.success === false && response.data.error === 'Balance info not found') {
        return true
      }

      let threshold = 10000
      if (response.data.balance && response.data.balance.balanceShow > threshold) {
        this.logger.info(`Balance: ${response.data.balance.balanceShow} ${this.config.uia.asset}`, { meta: 'inverse' })
        throw new Error('enough_tokens')
      } else {
        return true
      }
    } else {
      throw new Error('error_during_requesting_asset_balance')
    }
  }

  this.createTokens = () => {
    let currency = `${this.config.uia.publisher}.${this.config.uia.asset}`
    let amount = (20000 * 1e8).toString()

    let transaction = aschJS.uia.createIssue(currency, amount, this.config.dapp.masterAccountPassword, this.config.dapp.masterAccountPassword2nd)

    let url = `${this.config.node.host}:${this.config.node.port}/peer/transactions`
    let data = {
      transaction: transaction
    }
    let headers = {
      headers: {
        magic: this.config.node.magic,
        version: ''
      }
    }

    return axios.post(url, data, headers)
  }

  this.processCreateTokens = (response) => {
    if (response.status === 200) {
      if (response.data.success === true) {
        let amount = 20000
        this.logger.info(`${amount} ${this.config.uia.asset} tokens successfully created`, { meta: 'inverse' })
        return true
      } else if (response.data.error === 'Exceed issue limit') {
        throw new Error(`exceeded_issue_limit: You want to create more tokens then possible, use another Asset then "${this.config.uia.asset}", or reset the asch blockchain with deleting the "asch/blockchain.db" file and start again`)
      } else {
        throw new Error(`error_during_creation_of_tokens, ${response.data.error}`)
      }
    } else {
      throw new Error('error_during_creation_of_tokens')
    }
  }

  this.start = () => {
    return this.getAssetBalance()
      .then((response) => {
        return this.processAssetBalance(response)
      })
      .then(() => {
        return this.createTokens()
      })
      .then((response) => {
        return this.processCreateTokens(response)
      })
      .then(() => {
        this.logger.info(`waiting 11 sec for the create token transaction to be persisted to the next block...`)
        return this.promise.delay(this.waitingMS)
      })
      .then(() => {
        return true
      })
      .catch((error) => {
        if (error.message.startsWith('enough_tokens')) {
          return true
        } else {
          throw error
        }
      })
  }
}

module.exports = CreateTokens
