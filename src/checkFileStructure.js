const path = require('path')
const fs = require('fs')
const Promise = require('bluebird')
const chalk = require('chalk')
const log = console.log

// ctor
let Exists = function (userDevDir) {
  if (!(typeof userDevDir === 'string')) {
    throw new Error('param userDevDir must be of type string')
  }
  this.userDevDir = userDevDir

  this.printNecessaryDirectories = () => {
    let message = chalk.yellow('Expected following structure')
    message += chalk.magenta('\n\t contract/')
    message += chalk.magenta('\n\t interface/')
    message += chalk.magenta('\n\t model/')
    message += chalk.magenta('\n\t public/')
    message += chalk.magenta('\n\t init.js')
    log(message)
  }

  this.check = function () {
    let self = this
    return new Promise(function (resolve, reject) {
      console.log(`NODE_ENV: ${process.env['NODE_ENV']}`)
      if (process.env['NODE_ENV'] === 'development') {
        resolve(true)
        return
      }

      log(chalk.yellow(`Check folder structure in ${self.userDevDir}`))

      // contract
      let contractDir = path.join(self.userDevDir, 'contract')
      if (!fs.existsSync(contractDir)) {
        self.printNecessaryDirectories()
        reject(new Error('contract directory doesn\'t exist'))
        return
      }
      log(chalk.yellow('\t contract/'), chalk.green('✓'))

      // interface
      let interfaceDir = path.join(self.userDevDir, 'interface')
      if (!fs.existsSync(interfaceDir)) {
        Promise.reject(new Error('interface directory doesn\'t exist'))
        return
      }
      log(chalk.yellow('\t interface/'), chalk.green('✓'))

      // model
      let modelDir = path.join(self.userDevDir, 'model')
      if (!fs.existsSync(modelDir)) {
        Promise.reject(new Error('model directory doesn\'t exist'))
        return
      }
      log(chalk.yellow('\t model/'), chalk.green('✓'))

      // public
      let publicDir = path.join(self.userDevDir, 'public')
      if (!fs.existsSync(publicDir)) {
        Promise.reject(new Error('public directory doesn\'t exist'))
        return
      }
      log(chalk.yellow('\t public/'), chalk.green('✓'))

      // init.js
      let initFile = path.join(self.userDevDir, 'init.js')
      if (!fs.existsSync(initFile)) {
        Promise.reject(new Error('init.js file doesn\'t exist'))
        return
      }
      log(chalk.yellow('\t init.js file'), chalk.green('✓'))

      resolve(true)
    })
  }
}

module.exports = Exists
