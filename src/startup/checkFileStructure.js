const path = require('path')
const fs = require('fs')
const logger = require('../logger')

// ctor
let CheckFileStructure = function (config) {
  this.config = config

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

  this.checkSync = () => {
    logger.verbose(`NODE_ENV: ${process.env['NODE_ENV']}`)
    if (process.env['NODE_ENV'] === 'development') {
      return true
    }

    logger.verbose(`Check folder structure in ${this.config.userDevDir}`)
    let greenUnderline = { meta: 'green.underline' }

    // contract
    let contractDir = path.join(this.config.userDevDir, 'contract')
    if (!fs.existsSync(contractDir)) {
      this.printNecessaryDirectories()
      throw new Error('contract directory doesn\'t exist')
    }
    logger.info('\t contract/ ✓', greenUnderline)

    // interface
    let interfaceDir = path.join(this.config.userDevDir, 'interface')
    if (!fs.existsSync(interfaceDir)) {
      throw new Error('interface directory doesn\'t exist')
    }
    logger.info('\t interface/ ✓', greenUnderline)

    // model
    let modelDir = path.join(this.config.userDevDir, 'model')
    if (!fs.existsSync(modelDir)) {
      throw new Error('model directory doesn\'t exist')
    }
    logger.info('\t model/ ✓', greenUnderline)

    // public
    let publicDir = path.join(this.config.userDevDir, 'public')
    if (!fs.existsSync(publicDir)) {
      throw new Error('public directory doesn\'t exist')
    }
    logger.info('\t public/ ✓', greenUnderline)

    // init.js
    let initFile = path.join(this.config.userDevDir, 'init.js')
    if (!fs.existsSync(initFile)) {
      throw new Error('init.js file doesn\'t exist')
    }
    logger.info('\t init.js file ✓', greenUnderline)

    return true
  }
}

module.exports = CheckFileStructure
