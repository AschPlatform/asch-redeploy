const shelljs = require('shelljs')

// constructor
// https://github.com/embark-framework/embark/blob/69e264e765832c2010ed7a076c3db162e995b40e/lib/cmds/blockchain/blockchain.js
let aschService = function (aschServiceLocation) {
  this.aschServiceLocation = aschServiceLocation

  this.execute = function (command) {

    let self = this
    return new Promise(function (resolve, reject) {
      let result = shelljs.exec(`cd ${self.aschServiceLocation} && ./aschd ${command}`)
      resolve(result.stdout)
    }).then(function (result) {
      return new Promise(resolve => {
        setTimeout(function () {
          resolve(result)
        }, 5000)
      })
    })

  }
}

module.exports = aschService
