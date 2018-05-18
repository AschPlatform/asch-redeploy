const path = require('path')
const fs = require('fs')

// ctor
let exists = function (userDevDir) {
  if (!(typeof userDevDir === 'string')) {
    throw new Exception('param userDevDir must be of type string')
  }
  this.userDevDir = userDevDir


  this.check = function () {
    let self = this
    return new Promise(function (resolve, reject) {
      let contractDir = path.join(self.userDevDir, 'contract')
      if (!fs.existsSync(contractDir)) {
        Promise.reject('contract directory doesn\'t exist')
      }
      
      let interfaceDir = path.join(self.userDevDir, 'interface')
      if (!fs.existsSync(interfaceDir)) {
        Promise.reject('interface directory doesn\'t exist')
      }

      let modelDir = path.join(self.userDevDir, 'model')
      if (!fs.existsSync(modelDir)) {
        Promise.reject('model directory doesn\'t exist')
      }

      let publicDir = path.join(self.userDevDir, 'public')
      if (!fs.existsSync(publicDir)) {
        Promise.reject('public directory doesn\'t exist')
      }

      let initFile = path.join(self.userDevDir, 'init.js')
      if (!fs.existsSync(initFile)) {
        Promise.reject('init.js file doesn\'t exist')
      }

      Promse.resolve(true)
    })
  }
}

module.exports = exists
