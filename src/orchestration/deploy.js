const Promise = require('bluebird')

// constructor
let deploy = function (config, copyDirectory, path, fs) {
  this.config = config
  this.copyDirectory = copyDirectory
  this.path = path
  this.fs = fs

  this.deploy = (dappId) => {
    return new Promise((resolve, reject) => {
      if (typeof dappId !== 'string') {
        throw new Error('dappId must be of type string')
      }

      let dappParentDir = this.path.join(this.config.node.directory, 'dapps')

      let existsDappDir = this.fs.existsSync(dappParentDir)

      if (existsDappDir === false) {
        this.fs.mkdirSync(dappParentDir)
      }

      let newDappDirectory = this.path.join(this.config.node.directory, 'dapps', dappId)
      this.fs.mkdirSync(newDappDirectory)

      // let dappConfig = {
      //   peers: [],
      //   secrets: this.config.dapp.delegates
      // }
      // let dappConfigPath = path.join(this.config.userDevDir, 'config.json')
      // dappConfig.secrets = []
      // dappConfig.secrets.push(...this.config.dapp.delegates)
      // fs.writeFileSync(dappConfigPath, JSON.stringify(dappConfig, null, 2), 'utf8')

      this.copyDirectory(this.config.userDevDir, newDappDirectory, (err) => {
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
