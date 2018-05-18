let aschJS = require('asch-js')
let fs = require('fs')
let path = require('path')
let axios = require('axios')
let ncp = require('ncp').ncp

// constructor
let deploy = function (config) {
  this.config = config

  this.peerTransactionUrl = `${config.node.host}:${config.node.port}/peer/transactions`
  this.header = {
    magic: this.config.magic,
    version: ''
  }

  this.sendMoney = function () {
    let genesisSecret = this.config.node.genesisAccount
    let toSecret = this.config.dapp.masterAccountPassword
    let toAddress = aschJS.crypto.getAddress(aschJS.crypto.getKeys(toSecret).publicKey)

    let amount = 1000
    console.log(`Sending ${amount} XAS to "${toAddress}"...`)

    let self = this
    return new Promise(function (resolve, reject) {
      var trs = aschJS.transaction.createTransaction(
        toAddress,
        Number(amount * 1e8),
        null,
        genesisSecret,
        null
      )

      resolve(axios({
        method: 'POST',
        url: self.peerTransactionUrl,
        headers: self.header,
        data: {
          transaction: trs
        }
      }))
    
    })
  } // end sendMoney


  this.registerDapp = function (callback) {
    let secret = this.config.dapp.masterAccountPassword
    let secondSecret = this.config.dapp.masterAccountPassword2nd
  
    let dappJsFile = path.join(config.userDevDir, 'dapp.json')
    // todo check if file exists
    var dapp = JSON.parse(fs.readFileSync(dappJsFile, 'utf8'));
    let trs = aschJS.dapp.createDApp(dapp, secret, secondSecret)


    return axios({
      method: 'POST',
      url: this.peerTransactionUrl,
      headers: this.header,
      data: {
        transaction: trs
      }
    })
  } // deploy end

  this.copyFiles = function (dappId) {
    let self = this
    return new Promise(function (resolve, reject) {
      let dappParentDir = path.join(self.config.node.directory, 'dapps')
      let existsDappDir = fs.existsSync(dappParentDir)
      if(existsDappDir === false) {
        fs.mkdirSync(dappParentDir)
      }

      let newDappDirectory = path.join(self.config.node.directory, 'dapps', dappId)
      fs.mkdirSync(newDappDirectory)
  
      let dappConfigPath = path.join(self.config.userDevDir,  'config.json')
      let dappConfig = JSON.parse(fs.readFileSync(dappConfigPath, 'utf8'))
  
      dappConfig.secrets = []
      dappConfig.secrets.push(...self.config.dapp.delegates)
      fs.writeFileSync(dappConfigPath, JSON.stringify(dappConfig, null, 2), 'utf8')
  
      ncp(self.config.executionDir, newDappDirectory, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
      })
    })

    
  } // end copyFiles
}

module.exports = deploy
