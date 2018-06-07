const ZSchema = require('z-schema')
const customValidators = require('./customValidators')

// ctor
let IsConfigValid = function (config, logger) {
  this.config = config
  this.logger = logger

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
      this.logger.error('validation_error: Error after validationg configuration')
      throw new Error(JSON.stringify(errors))
    }
  }
}

module.exports = IsConfigValid
