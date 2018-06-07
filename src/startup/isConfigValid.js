const ZSchema = require('z-schema')
const customValidators = require('./customValidators')
const logger = require('../logger')

// ctor
let IsConfigValid = function (config) {
  this.config = config

  this.isValidSync = () => {
    let validator = new ZSchema({
      reportPathAsArray: true,
      breakOnFirstError: false,
      forceItems: true
    })

    if (!customValidators.areNewFormatsRegistered()) {
      throw new Error('z-schema validators bip39 and file are not registered')
    }

    let schema = require('./configSchema')
    let valid = validator.validate(this.config, schema)
    if (valid === true) {
      return true
    } else {
      let errors = validator.getLastErrors()
      logger.error(JSON.stringify(errors), { meta: 'underline' })
      return false
    }
  }
}

module.exports = IsConfigValid
