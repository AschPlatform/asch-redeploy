const shelljs = require('shelljs')
const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events');
const fs = require('fs')

// api:
// start
// end
// onExit

// ctor
let aschService = function (aschNodeDir, logDir) {
  this.aschNodeDir = aschNodeDir
  this.logDir = logDir
  this.notifier = new EventEmitter()

  this.start = function () {
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



    // this.process.stdout.pipe(logStream)
    // this.process.stderr.pipe(logStream)
    this.process.on('error', this.onError)
    this.process.on('exit', this.onExit)
    this.process.on('message', this.onMessage)
  }

  this.stop = function () {
    console.log('sending SIGTERM signal to child process')
    this.process.kill('SIGTERM')
  }

  let self = this

  this.onStdIn = function (data) {
    console.log(`stdin: ${data}`)
  }
  this.onStdOut = function (data) {
    console.log(`stdout ${data}`)
  }
  this.onError = function (err) {
    console.log(`error: ${err}`)
  }
  this.onExit = function (code) {
    console.log(`EXIT exitCode: ${code}`)
    self.notifier.emit('exit', code)
  }
  this.onMessage = function (message) {
    console.log(`aschMessage: ${message}`)
  }
}

module.exports = aschService
