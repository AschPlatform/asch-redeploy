const fs = require('fs')
const path = require('path')
const copyDirectory = require('./copyDirectory')
const Promise = require('bluebird')

// constructor
let deploy = function (config) {
  this.config = config

  this.deploy = (dappId) => {
    return new Promise((resolve, reject) => {
      if (typeof dappId !== 'string') {
        throw new Error('dappId must be of type string')
      }

      let dappParentDir = path.join(this.config.node.directory, 'dapps')

      let existsDappDir = fs.existsSync(dappParentDir)

      if (existsDappDir === false) {
        fs.mkdirSync(dappParentDir)
      }

      let newDappDirectory = path.join(this.config.node.directory, 'dapps', dappId)
      fs.mkdirSync(newDappDirectory)

      // let dappConfig = {
      //   peers: [],
      //   secrets: this.config.dapp.delegates
      // }
      // let dappConfigPath = path.join(this.config.userDevDir, 'config.json')
      // dappConfig.secrets = []
      // dappConfig.secrets.push(...this.config.dapp.delegates)
      // fs.writeFileSync(dappConfigPath, JSON.stringify(dappConfig, null, 2), 'utf8')

      copyDirectory(this.config.userDevDir, newDappDirectory, (err) => {
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
