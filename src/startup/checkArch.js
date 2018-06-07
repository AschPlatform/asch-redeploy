const Promise = require('bluebird')

let CheckArch = function () {
  this.check = () => {
    return new Promise((resolve, reject) => {
      if (process.platform !== 'linux') {
        reject(new Error('only_linux: This program can currently run only on linux'))
      } else {
        resolve(true)
      }
    })
  }
}

module.exports = CheckArch
