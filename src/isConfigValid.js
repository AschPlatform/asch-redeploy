const path = require('path')
const config = require('config')
const chalk = require('chalk')
const utils = require('./utils')
const Promise = require('bluebird')
const ZSchema = require('z-schema')

// ctor
let IsConfigValid = function (userDevDir) {
  if (typeof userDevDir !== 'string') {
    throw new Error('userDevDir must be of type string')
  }
  this.userDevDir = userDevDir

  let loadConfig = () => {
    let mainDir = utils.getParentDirectory(__dirname)
    process.env['NODE_CONFIG_DIR'] = path.join(mainDir, 'config')

    let defaultConfig = config.get('config')
    defaultConfig.userDevDir = this.userDevDir

    console.log(chalk.green(JSON.stringify(defaultConfig, null, 2)))
    return defaultConfig
  }

  let isValid = function (configuration) {
    let validator = new ZSchema()
    let schema = require('./configSchema')

    let valid = validator.validate(configuration, JSON.stringify(schema))
    console.log(valid.isValid)
    var errors = validator.getLastErrors()
    console.log(errors)
    // TODO Check
    return true
  }

  this.getConfig = function () {
    return new Promise((resolve, reject) => {
      let loadedConfig = loadConfig()
      let result = isValid(loadedConfig)
      if (result === true) {
        resolve(loadedConfig)
      } else {
        reject(new Error('configuration is not valid!'))
      }
    })
  }
}

module.exports = IsConfigValid
