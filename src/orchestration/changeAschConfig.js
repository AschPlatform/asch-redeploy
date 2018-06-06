
let ChangeAschConfig = function (config, fs, path) {
  this.config = config
  this.fs = fs
  this.path = path

  this.add = (dappId) => {
    return new Promise((resolve, reject) => {
      if (typeof dappId !== 'string') {
        reject(new Error('"dappId" must be provided'))
        return
      }

      let aschNodeConfigPath = path.join(this.config.node.directory, 'config.json')
      console.log(`aschNodeConfigPath: ${aschNodeConfigPath}`)
      let aschConfig = JSON.parse(fs.readFileSync(aschNodeConfigPath, 'utf8'))

      let newOption = [this.config.dapp.masterAccountPassword]
      aschConfig.dapp.params[dappId] = newOption

      fs.writeFileSync(aschNodeConfigPath, JSON.stringify(aschConfig, null, 2), 'utf8')
      resolve(true)
    })
  }
}

module.exports = ChangeAschConfig
