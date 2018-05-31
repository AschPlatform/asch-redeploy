const axios = require('axios')
const aschJS = require('asch-js')
const Promise = require('bluebird')
const logger = require('../logger')

// ctor
let sendMoney = function (config) {
  this.config = config
  let toSecret = this.config.dapp.masterAccountPassword
  let toAddress = aschJS.crypto.getAddress(aschJS.crypto.getKeys(toSecret).publicKey)

  this.getBalance = function () {
    let self = this
    let url = `${self.config.node.host}:${self.config.node.port}/api/accounts/getBalance`
    return axios.get(url, {
      params: {
        address: toAddress
      }
    })
  } // getBalance

  this.enoughMoney = function (response) {
    let min = 1000
    if (response.status === 200 && response.data.success === true && (response.data.balance / 1e8) >= min) {
      logger.verbose(`enough money on account. No transfer needed. Balance is ${response.data.balance}`)
      throw new Error('enough_money')
    } else {
      return null
    }
  } // enoughMoney

  this.transfer = function () {
    let amount = 20000
    let genesisSecret = config.node.genesisAccount

    var trs = aschJS.transaction.createTransaction(
      toAddress,
      Number(amount * 1e8),
      null,
      genesisSecret,
      null
    )
    let peerTransactionUrl = `${config.node.host}:${config.node.port}/peer/transactions`
    let header = {
      magic: config.node.magic,
      version: ''
    }
    return axios({
      method: 'POST',
      url: peerTransactionUrl,
      headers: header,
      data: {
        transaction: trs
      }
    })
  } // transfer

  this.handleTransferResponse = function (response) {
    if (response.status !== 200) {
      Promise.reject(new Error('Could not send money'))
    }
    if (response.data.success === false) {
      Promise.reject(new Error(response.data.error))
    }
    logger.verbose(`successful created money transaction: ${response.data.transactionId}`)
    return null
  } // handleTransfer

  this.sendMoney = function (amount) {
    return this.getBalance()
      .then(this.enoughMoney)
      .then(this.transfer)
      .then(this.handleTransferResponse)
      .catch(function (error) {
        if (error && error.message === 'enough_money') {
          return null
        }
        throw error
      })
  }
}

module.exports = sendMoney
