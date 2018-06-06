const fs = require('fs')
const path = require('path')
const copyDirectory = require('./copyDirectory')
const Promise = require('bluebird')

// constructor
let deploy = function (config) {
  this.config = config

  this.copyFiles = function (dappId) {
    let self = this
    return new Promise(function (resolve, reject) {
      let dappParentDir = path.join(self.config.node.directory, 'dapps')

      let existsDappDir = fs.existsSync(dappParentDir)

      if (existsDappDir === false) {
        fs.mkdirSync(dappParentDir)
      }

      let newDappDirectory = path.join(self.config.node.directory, 'dapps', dappId)
      fs.mkdirSync(newDappDirectory)

      let dappConfigPath = path.join(self.config.userDevDir, 'config.json')
      let dappConfig = JSON.parse(fs.readFileSync(dappConfigPath, 'utf8'))

      dappConfig.secrets = []
      dappConfig.secrets.push(...self.config.dapp.delegates)
      fs.writeFileSync(dappConfigPath, JSON.stringify(dappConfig, null, 2), 'utf8')

      copyDirectory(self.config.userDevDir, newDappDirectory, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
      })
    })
  } // end copyFiles

  this.changeAschConfig = function () {
    let self = this
    return new Promise(function (resolve, reject) {
      let aschNodeConfigPath = path.join(self.config.node.directory, 'config.json')
      let aschConfig = JSON.parse(fs.readFileSync(aschNodeConfigPath, 'utf8'))

      let newOption = [self.config.dapp.masterAccountPassword]
      aschConfig.dapp.params[self.dappId] = newOption

      fs.writeFileSync(aschNodeConfigPath, JSON.stringify(aschConfig, null, 2), 'utf8')
      resolve('wrote asch/config.json successfully')
    })
  } // end changeAschConfig
}

module.exports = deploy
