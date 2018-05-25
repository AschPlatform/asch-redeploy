const watch = require('chokidar')
const EventEmitter = require('events')
const chalk = require('chalk')
const log = console.log

// ctor
function watcher (config) {
  this.config = config

  this.notifier = new EventEmitter()

  this.watch = function () {
    this.ef = watch.watch(this.config.watch)

    this.ef.on('add', (path) => {
      log(chalk.underline.green(`${path}`), chalk.yellow('has been added'))
      this.notifier.emit('fileChanged')
    })
    this.ef.on('change', (path) => {
      log(chalk.underline.magenta(`${path}`), chalk.yellow('has been changed'))
      this.notifier.emit('fileChanged')
    })
  }
}

module.exports = watcher
