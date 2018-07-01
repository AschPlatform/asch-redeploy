const Promise = require('bluebird')

// ctor
let UIA = function (config, registerPublisher) {
  this.config = config
  this.registerPublisher = registerPublisher

  this.start = () => {
    return Promise.delay(100)
      .then(() => {
        return this.registerPublisher.register()
      })
  }
}

module.exports = UIA
