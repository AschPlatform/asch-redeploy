const path = require('path')
const utils = require('../utils')
const Promise = require('bluebird')
const ZSchema = require('z-schema')
const customValidators = require('./customValidators')
const isPortAvailable = require('is-port-available')
const logger = require('../logger')
const yaml = require('js-yaml')

// ctor
let IsConfigValid = function (userDevDir) {
  if (typeof userDevDir !== 'string') {
    throw new Error('userDevDir must be of type string')
  }
  this.userDevDir = userDevDir

  let loadConfig = () => {
    let startupDir = utils.getParentDirectory(__dirname)
    let mainDir = utils.getParentDirectory(startupDir)
    process.env['NODE_CONFIG_DIR'] = path.join(mainDir, 'config')
    const config = require('config')

    let defaultConfig = config.util.toObject(config.get('config'))
    defaultConfig.userDevDir = this.userDevDir

    logger.info('Configuration:', { meta: 'inverse' })
    logger.info(`\n${yaml.safeDump(defaultConfig)}`, { meta: 'white.inverse' })
    return defaultConfig
  }

  let isValid = function (configuration) {
    let validator = new ZSchema({
      reportPathAsArray: true,
      breakOnFirstError: false,
      forceItems: true
    })

    if (!customValidators.areNewFormatsRegistered()) {
      throw new Error('z-schema validators bip39 and file are not registered')
    }

    let schema = require('./configSchema')
    let valid = validator.validate(configuration, schema)
    if (valid === true) {
      return true
    } else {
      let errors = validator.getLastErrors()
      logger.error(JSON.stringify(errors), { meta: 'underline' })
      return false
    }
  }

  this.getConfig = function () {
    return new Promise((resolve, reject) => {
      let loadedConfig = loadConfig()
      resolve(loadedConfig)
    })
      .then((config) => {
        return new Promise((resolve, reject) => {
          let result = isValid(config)
          if (result === true) {
            resolve(config)
          } else {
            reject(new Error('configuration is not valid!'))
          }
        })
          .then((config) => {
            return isPortAvailable(config.node.port)
              .then((status) => {
                if (status === false) {
                  throw new Error(`port ${config.node.port} is is already in use. Do you have a asch-node already running?`)
                }
                return config
              })
          })
      })
  }
}

module.exports = IsConfigValid
