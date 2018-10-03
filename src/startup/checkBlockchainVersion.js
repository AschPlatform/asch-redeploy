
// ctor
let checkBlockchainVersion = function (config, path, fs, logger, compareVersions) {
  this.config = config
  this.path = path
  this.fs = fs
  this.logger = logger
  this.compareVersions = compareVersions

  this.checkSync = () => {
    let msg = 'This version of asch-redeploy is only compatible with ASCH blockchain version greater or equal to 1.4.0'

    let pathToPackageJson = path.join(this.config.node.directory, 'package.json')
    let packageJson = fs.readFileSync(pathToPackageJson, 'utf8')
    packageJson = JSON.parse(packageJson)
    let version = packageJson.version

    let result = this.compareVersions('1.4.2', version)
    if (result === 1) {
      throw new Error(msg)
    }

    return true
  }
}

module.exports = checkBlockchainVersion
