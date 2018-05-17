let aschJS = require('asch-js')
let fs = require('fs')
let path = require('path')
let axios = require('axios')
let ncp = require('ncp').ncp

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
    return axios({
      method: 'POST',
      url: url,
      headers: {
        magic: this.config.magic,
        version: ''
      },
      data: {
        transaction: trs
      }
    })
  } // deploy end

  this.copyFiles = function (dappId) {
    let self = this
    return new Promise(function (resolve, reject) {
      let dappParentDir = path.join(self.config.asch, 'dapps')
      let existsDappDir = fs.existsSync(dappParentDir)
      if(existsDappDir === false) {
        fs.mkdirSync(dappParentDir)
      }

      let newDappDirectory = path.join(self.config.asch, 'dapps', dappId)
      fs.mkdirSync(newDappDirectory)
  
      let dappConfigPath = path.join(self.config.executionDir,  'config.json')
      let dappConfig = JSON.parse(fs.readFileSync(dappConfigPath, 'utf8'))
  
      dappConfig.secrets.push(...self.config.delegates)
      fs.writeFileSync(dappConfigPath, JSON.stringify(dappConfig), 'utf8')
  
      ncp(self.config.executionDir, newDappDirectory, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
      })
    })

    
  } // end copyFiles

  this.restartAsch = function () {
    return new Promise(function (resolve, reject) {
      
    })
  }
}



module.exports = deploy
