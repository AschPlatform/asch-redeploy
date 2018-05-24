// const Promise = require('bluebird')
const chalk = require('chalk')
const utils = require('./utils')
let IsConfigValid = require('./isConfigValid')
let CheckFileStructure = require('./checkFileStructure')
let checkArch = require('./checkArch')
const shelljs = require('shelljs')
let log = console.log

let getUserDevDir = () => {
  let userDevDir = shelljs.pwd().stdout
  console.log(chalk.red(`userDevDir: ${userDevDir}`))
  return userDevDir
}

let startUp = () => {
  let userDevDir = getUserDevDir()
  let check = new CheckFileStructure(userDevDir)

  checkArch()

  return check.check() // checkFileStructure
    .catch((er) => {
      log(chalk.yellow(er.message), chalk.red(er.stack))
      utils.endProcess()
    })
    .then(() => {
      let config = new IsConfigValid(userDevDir)
      return config.getConfig()
    })
    .catch((error) => {
      log(chalk.yellow('The configuration is not valid:'), chalk.red(error.message))
      utils.endProcess()
    })
}

module.exports = startUp
