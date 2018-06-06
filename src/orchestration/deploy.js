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

      copyDirectory(self.config.userDevDir, newDappDirectory, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(dappId)
        }
      })
    })
  } // end copyFiles
}

module.exports = deploy
