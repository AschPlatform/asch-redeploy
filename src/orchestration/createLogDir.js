
let CreateLogDir = function (config, fs, path, moment) {
  this.config = config
  this.fs = fs
  this.path = path
  this.moment = moment

  this.createDirSync = () => {
    let logDir = path.join(config.userDevDir, 'logs')
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir)
    }
    return logDir
  }

  this.createLogFileNameHandleSync = (logDir) => {
    if (typeof logDir !== 'string') {
      throw new Error('no_parameter: argument "logDir" must be provided')
    }
    let today = this.moment().format('YYYY-MM-DD')
    let logFile = this.path.join(logDir, `asch-node-${today}.log`)

    return this.fs.openSync(logFile, 'a')
  }
}

module.exports = CreateLogDir
