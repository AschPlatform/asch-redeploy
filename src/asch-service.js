const shelljs = require('shelljs')

// constructor
// https://github.com/embark-framework/embark/blob/69e264e765832c2010ed7a076c3db162e995b40e/lib/cmds/blockchain/blockchain.js
let aschService = function (aschServiceLocation) {
  this.aschServiceLocation = aschServiceLocation

  let execute = function (command) {
    function pause(milliseconds) {
      var dt = new Date();
      while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
    }

    pause(5000)
    let result = shelljs.exec(`cd ${this.aschServiceLocation} && ./aschd ${command}`)
    return result.stdout
    pause(7000)

  }.bind(this)

  this.start = function () {
    return execute('start')
  }
  this.stop  = function () {
    return execute('stop')
  }
  this.restart = function () {
    return execute('restart')
  }
  this.status = function () {
    return execute('status')
  }
}

module.exports = aschService
