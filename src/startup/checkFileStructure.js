const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const logger = require('../logger')

// ctor
let Exists = function (userDevDir) {
  if (!(typeof userDevDir === 'string')) {
    throw new Error('param userDevDir must be of type string')
  }
  this.userDevDir = userDevDir

  this.printNecessaryDirectories = () => {
    logger.info('Expected following structure', { meta: 'inverse' })
    let message = ''
    message += '\t contract/'
    message += '\n\t\t\t\t interface/'
    message += '\n\t\t\t\t model/'
    message += '\n\t\t\t\t public/'
    message += '\n\t\t\t\t init.js'
    logger.info(message, { meta: 'inverse' })
  }

  this.check = function () {
    let self = this
    return new Promise(function (resolve, reject) {
      logger.verbose(`NODE_ENV: ${process.env['NODE_ENV']}`)
      if (process.env['NODE_ENV'] === 'development') {
        resolve(true)
        return
      }

      logger.verbose(`Check folder structure in ${self.userDevDir}`)
      let greenUnderline = { meta: 'green.underline' }

      // contract
      let contractDir = path.join(self.userDevDir, 'contract')
      if (!fs.existsSync(contractDir)) {
        self.printNecessaryDirectories()
        reject(new Error('contract directory doesn\'t exist'))
        return
      }
      logger.info('\t contract/ ✓', greenUnderline)

      // interface
      let interfaceDir = path.join(self.userDevDir, 'interface')
      if (!fs.existsSync(interfaceDir)) {
        Promise.reject(new Error('interface directory doesn\'t exist'))
        return
      }
      logger.info('\t interface/ ✓', greenUnderline)

      // model
      let modelDir = path.join(self.userDevDir, 'model')
      if (!fs.existsSync(modelDir)) {
        Promise.reject(new Error('model directory doesn\'t exist'))
        return
      }
      logger.info('\t model/ ✓', greenUnderline)

      // public
      let publicDir = path.join(self.userDevDir, 'public')
      if (!fs.existsSync(publicDir)) {
        Promise.reject(new Error('public directory doesn\'t exist'))
        return
      }
      logger.info('\t public/ ✓', greenUnderline)

      // init.js
      let initFile = path.join(self.userDevDir, 'init.js')
      if (!fs.existsSync(initFile)) {
        Promise.reject(new Error('init.js file doesn\'t exist'))
        return
      }
      logger.info('\t init.js file ✓', greenUnderline)

      resolve(true)
    })
  }
}

module.exports = Exists
