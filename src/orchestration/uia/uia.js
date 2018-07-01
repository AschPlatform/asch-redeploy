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
        return this.registerPublisher.start()
      })
      .then(() => {
        return this.registerAsset.start()
      })
      .then(() => {
        return this.createTokens.start()
      })
  }
}

module.exports = UIA
