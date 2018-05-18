const shelljs = require('shelljs')

// ctor
let aschService = function (aschNodeDir) {
  this.aschNodeDir = aschNodeDir

  this.userDevDir = shelljs.pwd().stdout

  shelljs.pushd(this.aschNodeDir).stdout
  shelljs.pushd('+1').stdout
  shelljs.popd().stdout
  
  this.execute = function (command, timeout) {
    timeout = typeof timeout !== 'undefined' ? timeout : 5000

    return new Promise(function (resolve, reject) {
      let result = shelljs.exec(`./aschd ${command}`, { silent:true })
      resolve(result.stdout)
    })
    .then(function (result) {
      return new Promise(resolve => {
        console.log(`Waiting for ${timeout}ms`)

        setTimeout(function () {
          resolve(result)
        }, timeout)
      })
    })
    .catch(function (error) {
      console.log('error while executing:')
      console.error(error)
    })

  }
}

module.exports = aschService
