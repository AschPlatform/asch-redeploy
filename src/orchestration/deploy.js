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

      let dappParentDir = this.path.join(this.config.node.directory, 'chains')

      if (!this.fs.existsSync(dappParentDir)) {
        this.fs.mkdirSync(dappParentDir)
      }

      let dappName = 
      let newDappDirectory = this.path.join(this.config.node.directory, 'chains', dappName)
      this.fs.mkdirSync(newDappDirectory)


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
