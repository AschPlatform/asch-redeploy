// ctor
let IsConfigValid = function (config, logger, ZSchema, customValidators, configSchema) {
  this.config = config
  this.logger = logger
  this.ZSchema = ZSchema
  this.customValidators = customValidators
  this.configSchema = configSchema

  this.isValidSync = () => {
    let validator = new this.ZSchema({
      reportPathAsArray: true,
      breakOnFirstError: false,
      forceItems: true
    })

    if (!this.customValidators.areNewFormatsRegistered()) {
      throw new Error('z-schema validators bip39 and file are not registered')
    }

    let schema = this.configSchema
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
