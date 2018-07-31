
// ctor
let sendMoney = function (config, logger, axios, aschJS, promise) {
  this.config = config
  this.logger = logger
  this.axios = axios
  this.aschJS = aschJS
  this.Promise = promise

  if (typeof config !== 'object') {
    throw new Error('config must be of type object')
  }

  this.genesisAccount = {}
  this.dappAccount = {}

  this.fetchAddressAndBalancewithSecret = function (secret) {
    this.logger.verbose('in fetchAddressAndBalancewithSecret()')
    let url = `${this.config.node.host}:${this.config.node.port}/api/accounts/open`
    this.logger.verbose(`get account information from "${secret}"`)
    return this.axios.post(url, {
      secret: secret
    })
      .then(function (response) {
        if (response.status === 200 && response.data.success === true) {
          return {
            address: response.data.account.address,
            balance: response.data.account.balance
          }
        }
      })
      .catch(function (error) {
        throw error
      })
  } // fetchAddressAndBalancewithSecret

  this.hasGenesisAccountEnoughMoney = function (response) {
    this.logger.verbose('in hasGenesisAccountEnoughMoney()')
    let minBalance = 50000
    this.logger.verbose(`has genesisAccount a balance greater ${minBalance}?`)
    let balance = (response.balance / 1e8)
    if (balance >= minBalance) {
      return response
    } else {
      throw new Error(`genesisAccount_empty: config.node.genesisAccount is NOT a genesis account. Genesis account has only balance of ${balance} XAS. Are you using a localnet node?`)
    }
  } // hasGenesisAccountEnoughMoney

  this.saveGenesisAccountData = function (response) {
    this.logger.verbose('in saveGenesisAccountData()')
    this.genesisAccount = response
  } // saveGenesisAccountData

  this.hasDappAccountEnoughMoney = function (response) {
    this.logger.verbose('in hasDappAccountEnoughMoney()')
    let minBalance = 1000
    this.logger.verbose(`has dappAccount a balance greater ${minBalance}?`)
    let balance = (response.balance / 1e8)
    if (balance >= minBalance) {
      this.logger.verbose(`enough money on account. No transfer needed. Balance is ${balance} XAS`)
      throw new Error('enough_money')
    } else {
      this.logger.verbose(`dappAccount has only balance of ${balance} XAS. Account needs a recharge`)
      return response
    }
  } // enoughMoney

  this.saveDappAccountData = function (response) {
    this.logger.verbose('in saveDappAccountData()')
    this.dappAccount = response
  } // saveDappAccountData

  this.transfer = function (toAddress, fromSecret) {
    this.logger.verbose('in transfer()')
    let amount = 20000

    var trs = this.aschJS.transaction.createTransaction(
      toAddress,
      Number(amount * 1e8),
      null,
      fromSecret,
      null
    )
    let peerTransactionUrl = `${config.node.host}:${config.node.port}/peer/transactions`
    let header = {
      magic: config.node.magic,
      version: ''
    }
    return this.axios.post(peerTransactionUrl, { transaction: trs }, {
      headers: header
    })
  } // transfer

  this.handleTransferResponse = function (response) {
    this.logger.verbose('in handleTransferResponse()')
    if (response.status !== 200) {
      this.Promise.reject(new Error('Could not send money'))
    }
    if (response.data.success === false) {
      this.Promise.reject(new Error(response.data.error))
    }
    this.logger.info(`successful created money transaction: ${response.data.transactionId}`, { meta: 'green.inverse' })
    return response.data.transactionId
  } // handleTransfer

  this.sendMoney = function () {
    this.logger.verbose('in sendMoney()')
    let genesisSecret = this.config.node.genesisAccount
    let dappSecret = this.config.dapp.masterAccountPassword

    return this.fetchAddressAndBalancewithSecret(genesisSecret)
      .then((response) => {
        return this.hasGenesisAccountEnoughMoney(response)
      })
      .then((response) => {
        return this.saveGenesisAccountData(response)
      })
      .then(() => {
        return this.fetchAddressAndBalancewithSecret(dappSecret)
      })
      .then((response) => {
        return this.hasDappAccountEnoughMoney(response)
      })
      .then((response) => {
        return this.saveDappAccountData(response)
      })
      .then(() => {
        return this.transfer(this.dappAccount.address, genesisSecret)
      })
      .then((response) => {
        return this.handleTransferResponse(response)
      })
      .then(() => {
        this.logger.info(`wait for 11sec after money transaction`)
        return this.Promise.delay(11000)
      })
      .then(() => {
        return true
      })
      .catch((error) => {
        if (error && error.message === 'enough_money') {
          return 'enough_money'
        }
        throw error
      })
  }
}

module.exports = sendMoney
