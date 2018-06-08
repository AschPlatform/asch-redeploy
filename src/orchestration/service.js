const fork = require('child_process').fork
const Promise = require('bluebird')

// ctor
let Service = function (config, logger, moment, path, fs, EventEmitter, createLogDir) {
  this.config = config
  this.logger = logger
  this.moment = moment
  this.path = path
  this.fs = fs
  this.EventEmitter = EventEmitter
  this.createLogDir = createLogDir

  this.aschNodeDir = config.node.directory
  this.logDir = path.join(config.userDevDir, 'logs')
  this.port = config.node.port

  this.notifier = new EventEmitter()

  this.createLogFileName = () => {
    let today = this.moment().format('YYYY-MM-DD')
    let logFile = this.path.join(this.logDir, `asch-node-${today}.log`)
    return logFile
  }

  this.start = () => {
    return new Promise((resolve, reject) => {
      let logFile = this.createLogFileName()
      this.createLogDir.createSync()

      this.logger.info(`asch-node logs are saved in "${logFile}"`)
      let logStream = this.fs.openSync(logFile, 'a')

      let aschPath = this.path.join(this.aschNodeDir, 'app.js')
      this.logger.info(`starting asch-node in "${aschPath}" on port ${this.port}`)
      this.process = fork(aschPath, ['--port', parseInt(this.port)], {
        cwd: this.aschNodeDir,
        execArgv: [],
        stdio: [ 'ignore', logStream, logStream, 'ipc' ]
      })

      this.process.on('error', this.onError)
      this.process.on('exit', this.onExit)
      resolve(true)
    })
  }

  this.stop = () => {
    return new Promise((resolve, reject) => {
      this.logger.warn('sending SIGTERM signal to child process', { meta: 'inverse.blue' })
      this.process.kill('SIGTERM')
      resolve(true)
    })
  }

  this.onError = (err) => {
    this.logger.error(`error in asch-node ${err.message}`)
    this.logger.error(err.stack)
    this.process.kill('SIGTERM')
  }
  this.onExit = (code) => {
    this.logger.info(`asch-node exited wite code: "${code}"`, { meta: 'inverse.blue' })
    this.notifier.emit('exit', code)
  }
}

module.exports = Service
