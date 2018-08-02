
let ChangeAschConfig = function (config, fs, path, logger) {
  this.config = config
  this.fs = fs
  this.path = path
  this.logger = logger

  this.add = (dappId) => {
    return new Promise((resolve, reject) => {
      if (typeof dappId !== 'string') {
        reject(new Error('"dappId" must be provided'))
        return
      }

      let aschNodeConfigPath = path.join(this.config.node.directory, 'config.json')
      if (!this.fs.existsSync(aschNodeConfigPath)) {
        this.logger.warn(`file not found: "${aschNodeConfigPath}". Please provide a asch-node-directory with a config.json file`)
        throw new Error(`asch_config_file_not_found Not found ${aschNodeConfigPath}`)
      }
      let aschConfig = JSON.parse(this.fs.readFileSync(aschNodeConfigPath, 'utf8'))

      if (!aschConfig.chain) {
        aschConfig.chain = {}
      }

      if (!aschConfig.chain.params) {
        aschConfig.chain.params = {}
      }

      let newOption = [this.config.dapp.masterAccountPassword]
      aschConfig.chain.params[dappId] = newOption

      this.fs.writeFileSync(aschNodeConfigPath, JSON.stringify(aschConfig, null, 2), 'utf8')
      this.logger.info(`dappId successfully added to "${aschNodeConfigPath}"`, { meta: 'blue.inverse' })
      resolve(true)
    })
  }
}

module.exports = ChangeAschConfig
