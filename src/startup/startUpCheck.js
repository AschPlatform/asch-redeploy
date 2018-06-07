
// ctor
let StartUpCheck = function (config, isConfigValid, checkFileStructure, checkArch) {
  this.config = config
  this.isConfigValid = isConfigValid
  this.checkFileStructure = checkFileStructure
  this.checkArch = checkArch

  this.check = () => {
    return this.checkArch.check()
      .then(() => {
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
