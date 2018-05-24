// const Promise = require('bluebird')
const chalk = require('chalk')
const { endProcess } = require('./utils')
let IsConfigValid = require('./isConfigValid')
let CheckFileStructure = require('./checkFileStructure')
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
  return check.check() // checkFileStructure
    .catch((er) => {
      log(chalk.yellow(er.message), chalk.red(er.stack))
      endProcess()
    })
    .then(() => {
      let config = new IsConfigValid()
      return config.getConfig(userDevDir)
    })
    .catch((error) => {
      log(chalk.yellow('The configuration is not valid:'), chalk.red(error.message))
      endProcess()
    })
}

module.exports = startUp
