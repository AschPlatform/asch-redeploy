const path = require('path')
const config = require('config')
const shelljs = require('shelljs')
const chalk = require('chalk')
const Promise = require('bluebird')

// ctor
let IsConfigValid = function () {
  let loadConfig = function (userDevDir) {
    let mainDir = getParentDirectory(__dirname)
    process.env['NODE_CONFIG_DIR'] = path.join(mainDir, 'config')

    let defaultConfig = config.get('config')
    defaultConfig.userDevDir = userDevDir

    console.log(chalk.green(JSON.stringify(defaultConfig, null, 2)))
    return defaultConfig
  }

  let isValid = function (configuration) {
    // TODO Check
    return true
  }

  this.getConfig = function () {
    return new Promise(function (resolve, reject) {
      let loadedConfig = loadConfig()
      let result = isValid(loadedConfig)
      if (result === true) {
        resolve(loadedConfig)
      } else {
        reject(new Error('configuration is not valid!'))
      }
    })
  }
  let getParentDirectory = function (directory) {
    let split = directory.split(path.sep)
    return split.slice(0, (split.length - 1)).join(path.sep)
  }
}

module.exports = IsConfigValid
