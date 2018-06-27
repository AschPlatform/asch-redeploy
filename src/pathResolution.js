
let PathResolution = function (config, logger, path) {
  this.config = config
  this.logger = logger
  this.path = path

  this.getAbsoluteAschPathSync = () => {
    let aschNodeDir = this.config.node.directory
    let userDevDir = this.config.userDevDir

    // asch path is absolute
    if (aschNodeDir.startsWith(this.path.sep)) {
      return aschNodeDir
    }
    // asch path is parent
    if (aschNodeDir.startsWith('..')) {
      let result = path.join(userDevDir, aschNodeDir)
      return result
    }

    // asch path is same directory
    if (aschNodeDir.startsWith('./')) {
      let result = path.join(userDevDir, aschNodeDir)
      return result
    }

    throw new Error(`asch_node_not_found: directory "${aschNodeDir}" does not exists, specify with ASCH_NODE_DIR a absolute or relative path to an asch blockchain directory`)
  }
}

module.exports = PathResolution
