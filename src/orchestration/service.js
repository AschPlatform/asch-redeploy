const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events')
const utils = require('../utils')
const fs = require('fs')
const Promise = require('bluebird')
const moment = require('moment')
const logger = require('../logger')

// ctor
let Service = function (aschNodeDir, logDir, port) {
  this.aschNodeDir = aschNodeDir
  this.logDir = logDir
  this.port = port
  this.notifier = new EventEmitter()

  this.createLogDirIfNotExists = (logFile) => {
    let logDir = utils.getParentDirectory(logFile)
    let dirExists = fs.existsSync(logDir)
    if (dirExists === false) {
      fs.mkdirSync(logDir)
    }
  }

  this.createLogFileName = () => {
    let today = moment().format('YYYY-MM-DD')
    let logFile = path.join(this.logDir, `asch-node-${today}.log`)
    return logFile
  }

  this.start = () => {
    return new Promise((resolve, reject) => {
      let logFile = this.createLogFileName()
      this.createLogDirIfNotExists(logFile)

      logger.info(`asch-node logs are saved in "${logFile}"`)
      let logStream = fs.openSync(logFile, 'a')

      let aschPath = path.join(this.aschNodeDir, 'app.js')
      logger.info(`starting asch-node in "${aschPath}" on port ${this.port}`)
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
      logger.warn('sending SIGTERM signal to child process', { meta: 'inverse' })
      this.process.kill('SIGTERM')
      resolve(true)
    })
  }

  this.onError = (err) => {
    logger.error(`error in asch-node ${err.message}`)
    logger.error(err.stack)
    this.process.kill('SIGTERM')
  }
  this.onExit = (code) => {
    logger.info(`asch-node exited wite code: "${code}"`, { meta: 'inverse' })
    this.notifier.emit('exit', code)
  }
}

module.exports = Service
