
let CheckPort = function (config, isPortAvailable) {
  this.config = config
  this.isPortAvailable = isPortAvailable

  this.check = () => {
    return isPortAvailable(config.node.port)
      .then((status) => {
        if (status === false) {
          throw new Error(`port ${config.node.port} is is already in use. Do you have a asch-node already running?`)
        }
        return true
      })
  }
}

module.exports = CheckPort
