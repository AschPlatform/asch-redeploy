const watch = require('chokidar')
const EventEmitter = require('events')
const chalk = require('chalk')
const log = console.log

// ctor
function watcher (config) {
  this.config = config

  this.notify = new EventEmitter()

  this.watch = function () {
    console.log(chalk.green(`files are watched in userDevDir: ${this.config.userDevDir}`))
    this.chokidar = watch.watch(this.config.watch, {
      cwd: this.config.userDevDir,
      interval: 3000,
      depth: 10
    })

    this.chokidar.on('all', (event, name) => {
      log(chalk.underline.green(`${name}`), chalk.yellow(' has been'), chalk.green(` ${event}`))
      this.notify.emit('changed', {
        event,
        name
      })
    })
  }
}

module.exports = watcher
