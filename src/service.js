const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events')
const fs = require('fs')
const Promise = require('bluebird')

// ctor
let Service = function (aschNodeDir, logDir) {
  this.aschNodeDir = aschNodeDir
  this.logDir = logDir
  this.notifier = new EventEmitter()

  this.start = function () {
    return new Promise((resolve, reject) => {
      let logFile = path.join(this.logDir, 'debug.log')
      console.log(`logFile: ${logFile}`)
      let logStream = fs.openSync(logFile, 'a')

      let aschPath = path.join(this.aschNodeDir, 'app.js')
      this.process = fork(aschPath, [], {
        cwd: this.aschNodeDir,
        // silent: true,
        execArgv: [],
        stdio: [ 'ignore', logStream, logStream, 'ipc' ]
      })

      this.process.on('error', this.onError)
      this.process.on('exit', this.onExit)
      this.process.on('message', this.onMessage)
      resolve(true)
    })
  }

  this.stop = function () {
    return new Promise((resolve, reject) => {
      console.log('sending SIGTERM signal to child process')
      this.process.kill('SIGTERM')
      resolve(true)
    })
  }

  this.onStdIn = function (data) {
    console.log(`stdin: ${data}`)
  }
  this.onStdOut = function (data) {
    console.log(`stdout ${data}`)
  }
  this.onError = function (err) {
    console.log(`error: ${err}`)
  }
  this.onExit = (code) => {
    console.log(`EXIT exitCode: ${code}`)
    this.notifier.emit('exit', code)
  }
  this.onMessage = function (message) {
    console.log(`aschMessage: ${message}`)
  }
}

module.exports = Service
