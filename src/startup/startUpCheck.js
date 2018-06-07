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
        return this.isConfigValid.isValidSync()
      })
      .then(() => {
        return this.checkFileStructure.checkSync()
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = StartUpCheck
