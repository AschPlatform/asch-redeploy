// ctor
let IsUserConfigValid = function (config, userConfigSchema, logger, ZSchema, path, fs) {
  this.config = config
  this.userConfigSchema = userConfigSchema
  this.logger = logger
  this.ZSchema = ZSchema
  this.path = path
  this.fs = fs

  this.isValidSync = () => {
    let validator = new this.ZSchema({
      reportPathAsArray: true,
      breakOnFirstError: false,
      forceItems: true
    })

    let pathToUserConfig = path.join(this.config.userDevDir, 'config.json')

    if (!this.fs.existsSync(pathToUserConfig)) {
      throw new Error(`not_found: config file "${pathToUserConfig}" not found`)
    }

    let loadedUserConfig = fs.readFileSync(pathToUserConfig, 'utf8')
    loadedUserConfig = JSON.parse(loadedUserConfig)
    let userConfigSchema = this.userConfigSchema
    let valid = validator.validate(loadedUserConfig, userConfigSchema)
    if (valid === true) {
      return true
    } else {
      let lastError = validator.getLastError()

      this.logger.info(`local config.json: ${JSON.stringify(loadedUserConfig, null, 2)}`)
      this.logger.info('error during validation of local "config.json" file', { meta: 'red' })
      this.logger.info(lastError.details[0].message, { meta: 'green' })
      let path = lastError.details[0].path.join(' > ')
      this.logger.info(`error path: ${path}`, { meta: 'green' })
      throw new Error('Please check your local config.json file again')
    }
  }
}

module.exports = IsUserConfigValid
