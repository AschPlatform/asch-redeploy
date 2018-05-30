const utils = require('../utils')
const IsConfigValid = require('./isConfigValid')
const CheckFileStructure = require('./checkFileStructure')
const checkArch = require('./checkArch')
const shelljs = require('shelljs')
const logger = require('../logger')

let getUserDevDir = () => {
  let userDevDir = shelljs.pwd().stdout
  logger.verbose(`UserDevelopmentDirectory: ${userDevDir}`)
  return userDevDir
}

let startup = () => {
  let userDevDir = getUserDevDir()
  let check = new CheckFileStructure(userDevDir)

  checkArch()

  return check.check()
    .catch((err) => {
      logger.error(err.message, { meta: 'underline' })
      utils.endProcess()
    })
    .then(() => {
      let config = new IsConfigValid(userDevDir)
      return config.getConfig()
    })
    .catch((error) => {
      logger.error(`The configuration is not valid: ${error.message}`, { meta: 'underline' })
      utils.endProcess()
    })
}

module.exports = startup
