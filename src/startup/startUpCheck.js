
// ctor
let StartUpCheck = function (config, isConfigValid, checkFileStructure, isUserConfigValid, checkArch, checkPort, checkPublicDistDir, checkBlockchainVersion) {
  this.config = config
  this.isConfigValid = isConfigValid
  this.checkFileStructure = checkFileStructure
  this.isUserConfigValid = isUserConfigValid
  this.checkArch = checkArch
  this.checkPort = checkPort
  this.checkPublicDistDir = checkPublicDistDir
  this.checkBlockchainVersion = checkBlockchainVersion

  this.check = () => {
    return this.checkArch.check()
      .then(() => {
        return this.isConfigValid.isValidSync()
      })
      .then(() => {
        return this.checkFileStructure.checkSync()
      })
      .then(() => {
        return this.isUserConfigValid.isValidSync()
      })
      .then(() => {
        return this.checkPublicDistDir.createIfNotExistsSync()
      })
      .then(() => {
        return this.checkPort.check()
      })
      .then(() => {
        return this.checkBlockchainVersion.checkSync()
      })
      .catch((error) => {
        throw error
      })
  }
}

module.exports = StartUpCheck
