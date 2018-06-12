const Promise = require('bluebird')

// ctor
function Watcher (config, logger, chokidar, moment) {
  this.config = config
  this.logger = logger
  this.chokidar = chokidar
  this.moment = moment

  this.changedFiles = []

  this.watch = function () {
    this.logger.info(`files are watched in userDevDir: ${this.config.userDevDir}`, { meta: 'white.inverse' })
    this.choki = this.chokidar.watch(this.config.watch, {
      cwd: this.config.userDevDir,
      interval: 100,
      depth: 10,
      ignoreInitial: true
    })

    this.config.watch.forEach((value) => {
      logger.info(value, { meta: 'white.underline' })
    })

    this.choki.on('all', (event, name) => {
      this.logger.info(`${event} ${name}`, { meta: 'underline.white' })
      this.changedFiles.push({
        event: event,
        name: name,
        time: this.moment().unix()
      })
    })
  }

  this.shouldIWait = () => {
    if (this.changedFiles.length === 0) {
      return true
    }
    let sorted = this.changedFiles.sort((a, b) => {
      return b.time - a.time
    })

    let latest = sorted[0].time
    let current = this.moment().unix()
    if ((current - latest) <= 10) {
      this.logger.info('waiting for 10 seconds after the last change...')
      return true
    } else {
      return false
    }
  }

  this.waitForFileChanges = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.shouldIWait()) {
          resolve(this.waitForFileChanges()) // recursive
        } else {
          this.changedFiles = []
          resolve(true)
        }
      }, 3000)
    })
  }
}

module.exports = Watcher
