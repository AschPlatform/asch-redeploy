
// ctor
let CheckPublicDistDir = function (config, fs, path) {
  this.config = config
  this.fs = fs
  this.path = path

  this.createIfNotExistsSync = () => {
    // let distDir = path.join(config.node.directory, 'public', 'dist')
    // if (fs.existsSync(distDir) === false) {
    //   fs.mkdirSync(distDir)
    // }
    return true
  }
}

module.exports = CheckPublicDistDir
