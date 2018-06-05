
// ctor
let sendMoney = function (config) {
  this.config = config

  this.genesisAccount = {}
  this.dappAccount = {}

  this.fetchAddressAndBalancewithSecret = function (secret) {
    container.logger.info('in fetchAddressAndBalancewithSecret()')
    let url = `${this.config.node.host}:${this.config.node.port}/api/accounts/open`
    container.logger.verbose(`get account information from "${secret}"`)
    return container.axios.post(url, {
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
    container.logger.info('in hasGenesisAccountEnoughMoney()')
    let minBalance = 50000
    container.logger.verbose(`has genesisAccount a balance greater ${minBalance}?`)
    let balance = (response.balance / 1e8)
    if (balance >= minBalance) {
      return response
    } else {
      throw new Error(`config.node.genesisAccount is NOT a genesis account. Genesis account has only balance of ${balance} XAS. Are you using a localnet node?`)
    }
  }

  this.saveGenesisAccountData = function (response) {
    container.logger.info('in saveGenesisAccountData()')
    this.genesisAccount = response
  } // saveGenesisAccountData

  this.hasDappAccountEnoughMoney = function (response) {
    container.logger.info('in hasDappAccountEnoughMoney()')
    let minBalance = 1000
    container.logger.verbose(`has dappAccount a balance greater ${minBalance}?`)
    let balance = (response.balance / 1e8)
    if (balance >= minBalance) {
      container.logger.verbose(`enough money on account. No transfer needed. Balance is ${balance}`)
      throw new Error('enough_money')
    } else {
      container.logger.verbose(`dappAccount has only balance of ${balance} XAS. Account needs a recharge`)
      return response
    }
  } // enoughMoney

  this.saveDappAccountData = function (response) {
    container.logger.info('in saveDappAccountData()')
    this.dappAccount = response
  }

  this.transfer = function (toAddress, fromSecret) {
    container.logger.info('in transfer()')
    let amount = 20000

    var trs = container.aschJS.transaction.createTransaction(
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
    return container.axios({
      method: 'POST',
      url: peerTransactionUrl,
      headers: header,
      data: {
        transaction: trs
      }
    })
  } // transfer

  this.handleTransferResponse = function (response) {
    container.logger.info('in handleTransferResponse()')
    if (response.status !== 200) {
      container.Promise.reject(new Error('Could not send money'))
    }
    if (response.data.success === false) {
      container.Promise.reject(new Error(response.data.error))
    }
    container.logger.verbose(`successful created money transaction: ${response.data.transactionId}`)
    return null
  } // handleTransfer

  this.sendMoney = function () {
    container.logger.info('in sendMoney()')
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
      .then(() => {
        return this.handleTransferResponse
      })
      .catch(function (error) {
        if (error && error.message === 'enough_money') {
          return null
        }
        throw error
      })
  }
}

module.exports = sendMoney
