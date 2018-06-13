
// ctor
let StartUpCheck = function (config, isConfigValid, checkFileStructure, checkArch, checkPort, checkPublicDistDir) {
  this.config = config
  this.isConfigValid = isConfigValid
  this.checkFileStructure = checkFileStructure
  this.checkArch = checkArch
  this.checkPort = checkPort
  this.checkPublicDistDir = checkPublicDistDir

  this.check = () => {
    return this.checkArch.check()
      .then(() => {
        return this.isConfigValid.isValidSync()
      })
      .then(() => {
        return this.checkFileStructure.checkSync()
      })
      .then(() => {
        return this.checkPublicDistDir.createIfNotExistsSync()
      })
      .then(() => {
        return this.checkPort.check()
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = StartUpCheck
