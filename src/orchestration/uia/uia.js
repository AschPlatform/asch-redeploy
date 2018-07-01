const Promise = require('bluebird')

// ctor
let UIA = function (config, logger, registerPublisher, registerAsset, createTokens) {
  this.config = config
  this.logger = logger
  this.registerPublisher = registerPublisher
  this.registerAsset = registerAsset
  this.createTokens = createTokens

  this.start = () => {
    return Promise.delay(100)
      .then(() => {
        return this.registerPublisher.register()
      })
      .then(() => {
        return Promise.delay(12000)
      })
      .then(() => {
        return this.registerAsset.registerAsset()
      })
      .then(() => {
        return Promise.delay(12000)
      })
      .then(() => {
        return this.createTokens.create()
      })
      .then(() => {
        return Promise.delay(5000)
      })
  }
}

module.exports = UIA
