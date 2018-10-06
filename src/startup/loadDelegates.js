
// ctor
const LoadDelegates = function (config, path, fs) {
  this.config = config
  this.path = path
  this.fs = fs

  this.loadSync = () => {
    let configJsonPath = path.join(this.config.userDevDir, 'config.json')
    let stringContent = this.fs.readFileSync(configJsonPath, 'utf8')
    let content = JSON.parse(stringContent)

    if (!content.secrets || !Array.isArray(content.secrets)) {
      throw new Error('you need an "config.json" file an secrets array property')
    }

    if (content.secrets.length === 0) {

      
    }

    this.config.dapp.delegates = content.secrets
    console.log(JSON.stringify(this.config.dapp.delegates))
    return true
  }
}

module.exports = LoadDelegates
