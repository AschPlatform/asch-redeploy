const shelljs = require('shelljs')
const fork = require('child_process').fork
const path = require('path')
const EventEmitter = require('events');

// api
// start
// end
// onExit



// ctor
let aschService = function (aschNodeDir) {
  this.aschNodeDir = aschNodeDir

  this = new EventEmitter()

  this.start = function () {
    
  }
  // this.userDevDir = shelljs.pwd().stdout

  // shelljs.pushd(this.aschNodeDir).stdout
  // shelljs.pushd('+1').stdout
  // shelljs.popd().stdout
  
  this.execute = function (command, timeout) {
    timeout = typeof timeout !== 'undefined' ? timeout : 5000

    let aschPath = path.join(this.aschNodeDir, 'app.js')
    this.process = fork(aschPath, [], {
      cwd: this.aschNodeDir,
      // stdio: 'pipe',
      stdout: 'inherit',
      execArgv: []
    })

    this.process.stdin.on('data', function (data) {
      console.log(`stdin: ${data}`)
    })
    this.process.stdout.on('data', function (data) {
      console.log(`stdout ${data}`)
    })
    this.process.on('error', function (err) {
      console.log(`error: ${err}`)
    })
    this.process.on('exit', function (code) {
      console.log(`EXIT exitCode: ${code}`)
    })
    this.process.on('message', function (message) {
      console.log(`aschMessage: ${message}`)
    })

    for (let i = 0; i < 1e8; ++i){
      
    }
    // return new Promise(function (resolve, reject) {
    // })
    // .then(function (result) {
    //   return new Promise(resolve => {
    //     console.log(`Waiting for ${timeout}ms`)

    //     setTimeout(function () {
    //       resolve(result)
    //     }, timeout)
    //   })
    // })
    // .catch(function (error) {
    //   console.log('error while executing:')
    //   console.error(error)
    // })

  }
}

module.exports = aschService
