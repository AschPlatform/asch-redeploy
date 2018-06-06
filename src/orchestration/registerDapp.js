
// ctor
let RegisterDapp = function (config, dappConfig, utils, axios, aschJS) {
  this.config = config
  this.dappConfig = dappConfig
  this.utils = utils
  this.axios = axios
  this.aschJS = aschJS

  this.peerTransactionUrl = `${config.node.host}:${config.node.port}/peer/transactions`
  this.header = {
    magic: this.config.node.magic,
    version: ''
  }

  this.register = () => {
    let secret = this.config.dapp.masterAccountPassword
    let secondSecret = this.config.dapp.masterAccountPassword2nd

    var dapp = this.dappConfig
    dapp.name = `${dapp.name}-${utils.generateRandomString(15)}`
    dapp.link = `${dapp.link.replace('.zip', '')}-${utils.generateRandomString(15)}.zip`
    let trs = aschJS.dapp.createDApp(dapp, secret, secondSecret)
    return this.axios.post(this.peerTransactionUrl, { transaction: trs }, {
      headers: this.header
    })
  }
}

module.exports = RegisterDapp
