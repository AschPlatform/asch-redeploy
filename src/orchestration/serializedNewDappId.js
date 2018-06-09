
let SerializedNewDappId = function (config, fs) {
  this.config = config
  this.fs = fs

  this.serializeSync = (dappId) => {
    if (this.config.output && this.config.output.file && this.config.output.file.length > 1) {
      let serializedConfig = {
        host: this.config.node.host,
        port: this.config.node.port,
        dappId: dappId
      }
      this.fs.writeFileSync(this.config.output.file, JSON.stringify(serializedConfig, null, 2), 'utf8')
      return true
    }
    return false
  }
}

module.exports = SerializedNewDappId
