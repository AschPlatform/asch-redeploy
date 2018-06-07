const checkArch = require('./checkArch')
const Promise = require('bluebird')

// ctor
let StartUpCheck = function (config, isConfigValid, checkFileStructure) {
  this.config = config
  this.isConfigValid = isConfigValid
  this.checkFileStructure = checkFileStructure

  this.check = () => {
    return new Promise((resolve, reject) => {
      resolve(checkArch())
    })
      .then((result) => {
        console.log('isValid?')
        // let isConfigValid = DI.container.get(DI.FILETYPES.IsConfigValid)
        let isValid = this.isConfigValid.isValidSync()
        return isValid
      })
      .then(() => {
        console.log('check file structure')
        // let checkFileStructure = DI.container.get(DI.FILETYPES.CheckFileStructure)
        return this.checkFileStructure.checkSync()
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = StartUpCheck
