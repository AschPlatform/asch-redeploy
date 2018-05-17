let aschJS = require('asch-js')
let fs = require('fs')
let path = require('path')
let axios = require('axios')

// constructor
let deploy = function (config) {
  this.config = config
}

deploy.registerDapp = function (callback) {
  let secret = this.config.dappMasterAccountPassword
  let secondSecret = this.config.dappMasterAccountPassword2nd

  let dappJsFile = path.join(config.executionDir, 'dapps.json')
  var dapp = JSON.parse(fs.readFileSync(dappJsFile, 'utf8'));

  let trs = aschJS.dapp.createDApp(dapp, secret, options.secondSecret)
  
  let url = `${config.host}:${config.port}/peer/transactions`
  axios.post(url, trs, function (err, result) {
    if (result.status === 200 && result.data.success === true) {
      callback(null, result.data.transactionId)
    } else {
      callback(err)
    }
  })
}

module.exports = deploy
