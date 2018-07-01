const Promise = require('bluebird')

// ctor
let UIA = function (config, logger, registerPublisher, registerAsset) {
  this.config = config
  this.logger = logger
  this.registerPublisher = registerPublisher
  this.registerAsset = registerAsset

  this.start = () => {
    return Promise.delay(100)
      .then(() => {
        return this.registerPublisher.register()
      })
      .then(() => {
        this.logger.info(`uia wait for 12sec`)
        return Promise.delay(12000)
      })
      .then(() => {
        this.logger.info(`register asset`)
        return this.registerAsset.registerAsset()
      })
      .then(() => {
        return Promise.delay(5000)
      })
  }
}

module.exports = UIA
