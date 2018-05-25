const watch = require('chokidar')
const EventEmitter = require('events')

// ctor
function watcher (config) {
  this.config = config

  this.notifier = new EventEmitter()

  this.watch = function () {
    this.ef = chokidar.watch(userDevDir.watch)
    this.ef.on('add', (path) => {
      console.log(`${path} has been added`)
      this.notifier.emit('fileChanged')
    })
    this.ef.on('change', (path) => {
      console.log(`${path} has been changed`)
      this.notifier.emit('fileChanged')
    })
  }
}

module.exports = watcher
