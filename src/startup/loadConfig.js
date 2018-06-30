const utils = require('../utils')
const path = require('path')

let loadConfig = (userConfig) => {
  let startupDir = utils.getParentDirectory(__dirname)
  let mainDir = utils.getParentDirectory(startupDir)
  process.env['NODE_CONFIG_DIR'] = path.join(mainDir, 'config')
  const config = require('config')

  let defaultConfig = config.util.toObject(config.get('config'))
  defaultConfig.userDevDir = process.cwd()

  let result = config.util.extendDeep(defaultConfig, userConfig)
  return result
}

module.exports = loadConfig
