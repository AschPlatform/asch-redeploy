const Promise = require('bluebird')

// ctor
function Watcher (config, logger, chokidar, moment) {
  this.config = config
  this.logger = logger
  this.chokidar = chokidar
  this.moment = moment

  this.changedFiles = []
  this.initialized = false

  this.watch = function () {
    if (this.initialized === true) {
      throw new Error('already_initialized: watcher.watch() has already been initialized')
    }
    this.logger.info('')
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

    this.initialized = true
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

  this.waitForFileChanges = (ms = 1000) => {
    return new Promise((resolve, reject) => {
      if (this.initialized === false) {
        reject(new Error('did_not_initialize: watcher.watch() has to be called first'))
        return
      }

      if (this.shouldIWait()) {
        resolve(Promise.delay(ms).then(() => this.waitForFileChanges())) // recursive
      } else {
        this.changedFiles = []
        resolve(true)
      }
    })
  }
}

module.exports = Watcher
