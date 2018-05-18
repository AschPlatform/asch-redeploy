const shelljs = require('shelljs')

// constructor
// https://github.com/embark-framework/embark/blob/69e264e765832c2010ed7a076c3db162e995b40e/lib/cmds/blockchain/blockchain.js
let aschService = function (aschServiceLocation) {
  this.aschServiceLocation = aschServiceLocation

  this.execute = function (command) {

    let self = this
    return new Promise(function (resolve, reject) {
      console.log(`execute command "${command} in "${self.aschServiceLocation}"`)
      let result = shelljs.exec(`cd ${self.aschServiceLocation} && ./aschd ${command}`)
      console.log('after execution of shell.js exec')
      console.log(result)
      resolve(result.stdout)
    }).then(function (result) {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(result)
        }, 15000)
      })
    })

  }
}

module.exports = aschService
