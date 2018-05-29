const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events')
const utils = require('../utils')
const fs = require('fs')
const Promise = require('bluebird')
const chalk = require('chalk')
const moment = require('moment')
let log = console.log

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

      log(chalk.magenta('asch-node logs to:'), chalk.green.underline(logFile))
      let logStream = fs.openSync(logFile, 'a')

      let aschPath = path.join(this.aschNodeDir, 'app.js')
      log(chalk.magenta(`starting asch-node in `), chalk.green.underline(`${aschPath} `), chalk.magenta(`on port `), chalk.green.underline(`${this.port}`))
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
      log(chalk.blue('sending SIGTERM signal to child process'))
      this.process.kill('SIGTERM')
      resolve(true)
    })
  }

  this.onError = (err) => {
    log(chalk.blue(`error: ${err}`))
  }
  this.onExit = (code) => {
    log(chalk.blue(`CHILD EXIT exitCode: ${code}`))
    this.notifier.emit('exit', code)
  }
}

module.exports = Service
