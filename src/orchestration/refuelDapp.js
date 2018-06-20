
let RefuelDapp = function (config, axios, aschJS) {
  this.config = config
  this.axios = axios
  this.aschJS = aschJS

  this.headers = {
    magic: this.config.node.magic,
    version: ''
  }

  this.refuel = (dappId) => {
    if (typeof dappId !== 'string') {
      throw new Error('dappId must be of type string')
    }

    let currency = 'XAS'
    let amount = 200 * 100000000
    var transaction = this.aschJS.transfer.createInTransfer(dappId, currency, amount, config.dapp.masterAccountPassword, config.dapp.masterAccountPassword2nd || undefined)

    let url = 'http://localhost:4096/peer/transactions'

    return this.axios.post(url, {
      transaction: transaction
    }, {
      headers: this.headers
    })
      .then((result) => {
        console.log(result)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

module.exports = RefuelDapp
