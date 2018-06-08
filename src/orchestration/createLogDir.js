
let CreateLogDir = function (config, fs, path) {
  this.config = config
  this.fs = fs
  this.path = path

  this.createSync = () => {
    let logDir = path.join(config.userDevDir, 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir)
    }
    return logDir
  }
}

module.exports = CreateLogDir
