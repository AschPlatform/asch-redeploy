const Promise = require('bluebird')

// ctor
let Service = function (config, logger, moment, path, fs, EventEmitter, createLogDir, fork, pathResolution) {
  this.config = config
  this.logger = logger
  this.moment = moment
  this.path = path
  this.fs = fs
  this.EventEmitter = EventEmitter
  this.createLogDir = createLogDir
  this.fork = fork
  this.pathResolution = pathResolution

  this.logDir = path.join(config.userDevDir, 'logs')
  this.port = config.node.port

  this.running = false

  this.notifier = new EventEmitter()

  this.start = () => {
    return new Promise((resolve, reject) => {
      let logDir = this.createLogDir.createDirSync()
      let logStream = this.createLogDir.createLogFileNameHandleSync(logDir)

      let absoluteAschPath = this.pathResolution.getAbsoluteAschPathSync()
      let appJS = this.path.join(absoluteAschPath, 'app.js')
      this.logger.info(`starting asch-node in "${absoluteAschPath}" on port ${this.port}`, { meta: 'inverse' })

      this.process = this.fork(appJS, ['--port', parseInt(this.port), '--log', 'trace'], {
        cwd: absoluteAschPath,
        execArgv: [],
        stdio: [ 'ignore', logStream, logStream, 'ipc' ]
      })
      this.running = true

      this.process.on('error', this.onError)
      this.process.on('exit', this.onExit)
      resolve(true)
    })
  }

  this.stop = () => {
    return new Promise((resolve, reject) => {
      if (this.running === false) {
        reject(new Error('no_process_started: No asch-node started. Be sure to call start() first'))
        return
      }
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
    this.logger.info(`asch-node exited with code: "${code}"`, { meta: 'inverse.blue' })
    this.notifier.emit('exit', code)
    this.running = false
  }
}

module.exports = Service
