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
        let uiaPropDoesNotExist = !this.config.uia
        let uiaPropExistButPublisherAndAssetPropNot = (this.config.uia && !this.config.uia.publisher && !this.config.uia.asset)

        if (uiaPropDoesNotExist || uiaPropExistButPublisherAndAssetPropNot) {
          throw new Error('no_publisher_no_asset')
        }
        return null
      })
      .then(() => {
        return this.registerPublisher.start()
      })
      .then(() => {
        return this.registerAsset.start()
      })
      .then(() => {
        return this.createTokens.start()
      })
      .catch((error) => {
        if (error.message === 'no_publisher_no_asset') {
          return true
        } else {
          throw error
        }
      })
  }
}

module.exports = UIA
