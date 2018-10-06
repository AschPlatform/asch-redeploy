// ctor
let IsUserConfigValid = function (config, userConfigSchema, logger, ZSchema, path, fs, aschJS) {
  this.config = config
  this.userConfigSchema = userConfigSchema
  this.logger = logger
  this.ZSchema = ZSchema
  this.path = path
  this.fs = fs
  this.aschJS = aschJS

  this.isValidSync = () => {
    let pathToUserConfig = path.join(this.config.userDevDir, 'config.json')
    let loadedUserConfig = this.fs.readFileSync(pathToUserConfig, 'utf8')
    loadedUserConfig = JSON.parse(loadedUserConfig)

    if (loadedUserConfig.secrets.length === 0) {
      this.logger.info('adding default delegates to "config.json"', { meta: 'white.inverse' })

      loadedUserConfig.secrets = this.config.dapp.delegates
      this.fs.writeFileSync(pathToUserConfig, JSON.stringify(loadedUserConfig, null, 2))
      this.logger.info(`after: ${JSON.stringify(loadedUserConfig, null, 2)}`, { meta: 'green' })
    }

    if (!loadedUserConfig.secrets) {
      throw new Error('the "config.json" file needs an "secrets" property')
    }

    this.config.dapp.delegates = []
    this.config.dapp.delegates.push(...loadedUserConfig.secrets)

    this.logger.info('using the following delgates from confir.json:')
    loadedUserConfig.secrets.forEach((secret) => {
      this.logger.info(`\t"${secret}"`)
    })

    let validator = new this.ZSchema({
      reportPathAsArray: true,
      breakOnFirstError: false,
      forceItems: true
    })
    let userConfigSchema = this.userConfigSchema
    let valid = validator.validate(loadedUserConfig, userConfigSchema)

    if (!valid) {
      let lastError = validator.getLastError()
      this.logger.info(`local config.json: ${JSON.stringify(loadedUserConfig, null, 2)}`)
      this.logger.info('error during validation of local "config.json" file', { meta: 'red' })
      this.logger.info(lastError.details[0].message, { meta: 'green' })
      let path = lastError.details[0].path.join(' > ')
      this.logger.info(`error path: ${path}`, { meta: 'green' })
      throw new Error('Please check your local config.json file again')
    } else {
      return true
    }
  }
}

module.exports = IsUserConfigValid
