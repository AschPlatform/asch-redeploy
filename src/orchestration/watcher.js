const watch = require('chokidar')
const EventEmitter = require('events')
const logger = require('../logger')

// ctor
function watcher (config) {
  this.config = config

  this.notify = new EventEmitter()

  this.watch = function () {
    logger.verbose(`files are watched in userDevDir: ${this.config.userDevDir}`)
    this.chokidar = watch.watch(this.config.watch, {
      cwd: this.config.userDevDir,
      interval: 3000,
      depth: 10
    })

    this.chokidar.on('all', (event, name) => {
      this.notify.emit('changed', {
        event,
        name
      })
    })
  }
}

module.exports = watcher
