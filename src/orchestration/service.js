const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events')
const fs = require('fs')
const Promise = require('bluebird')
const chalk = require('chalk')
let log = console.log

// ctor
let Service = function (aschNodeDir, logDir) {
  this.aschNodeDir = aschNodeDir
  this.logDir = logDir
  this.notifier = new EventEmitter()

  this.start = () => {
    return new Promise((resolve, reject) => {
      let logFile = path.join(this.logDir, 'debug.log')
      log(chalk.magenta(`asch-node logging to: ${logFile}`))
      let logStream = fs.openSync(logFile, 'a')

      let aschPath = path.join(this.aschNodeDir, 'app.js')
      this.process = fork(aschPath, [], {
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
