let aschJS = require('asch-js')
let fs = require('fs')
let path = require('path')
let axios = require('axios')

// constructor
let deploy = function (config) {
  this.config = config

  this.enoughMoney = function () {

  }
  // end enoughMoney

  this.registerDapp = function (callback) {
    let secret = this.config.dappMasterAccountPassword
    let secondSecret = this.config.dappMasterAccountPassword2nd
  
    let dappJsFile = path.join(config.executionDir, 'dapp.json')
    // todo check if file exists
    var dapp = JSON.parse(fs.readFileSync(dappJsFile, 'utf8'));
    let trs = aschJS.dapp.createDApp(dapp, secret, secondSecret)

    let url = `${config.host}:${config.port}/peer/transactions`
    axios({
      method: 'POST',
      url: url,
      headers: {
        magic: this.config.magic,
        version: ''
      },
      data: {
        transaction: trs
      }
    }).then(function (response) {
      if (response.data.success === true) {
        callback(null, response.data)
      } else {
        callback(null, response.data.error)
      }
    }).catch(function (err) {
      callback(err)
    })
  } // deploy end

  this.copyFiles = function (dappId, callback) {
    let newDappDirectory = path.join(this.config.asch, 'dapp', dappid)
    fs.mkdirSync(newDappDirectory)

    let dappConfigPath = path.join(this.config.executionDir,  'config.json')
    let dappConfig = JSON.parse(fs.readFileSync(dappConfigPath, 'utf8'))

    dappConfig.secret.push(this.config.delegates)
    fs.writeFileSync(dappConfigPath, dappConfig, 'utf8')

    
    callback()
  }
}



module.exports = deploy
