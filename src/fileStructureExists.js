const path = require('path')
const fs = require('fs')

// ctor
let exists = function (userDevDir) {
  if (!(typeof userDevDir === 'string')) {
    throw new Error('param userDevDir must be of type string')
  }
  this.userDevDir = userDevDir

  this.check = function () {
    let self = this
    return new Promise(function (resolve, reject) {
      let contractDir = path.join(self.userDevDir, 'contract')
      if (!fs.existsSync(contractDir)) {
        Promise.reject(new Error('contract directory doesn\'t exist'))
      }

      let interfaceDir = path.join(self.userDevDir, 'interface')
      if (!fs.existsSync(interfaceDir)) {
        Promise.reject(new Error('interface directory doesn\'t exist'))
      }

      let modelDir = path.join(self.userDevDir, 'model')
      if (!fs.existsSync(modelDir)) {
        Promise.reject(new Error('model directory doesn\'t exist'))
      }

      let publicDir = path.join(self.userDevDir, 'public')
      if (!fs.existsSync(publicDir)) {
        Promise.reject(new Error('public directory doesn\'t exist'))
      }

      let initFile = path.join(self.userDevDir, 'init.js')
      if (!fs.existsSync(initFile)) {
        Promise.reject(new Error('init.js file doesn\'t exist'))
      }

      Promise.resolve(true)
    })
  }
}

module.exports = exists
