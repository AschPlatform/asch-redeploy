const watch = require('chokidar')
const logger = require('../logger')
const moment = require('moment')
const Promise = require('bluebird')

// ctor
function watcher (config) {
  this.config = config

  this.changedFiles = []
  this.timesRestarted = 0

  this.watch = function () {
    logger.verbose(`files are watched in userDevDir: ${this.config.userDevDir}`)
    this.chokidar = watch.watch(this.config.watch, {
      cwd: this.config.userDevDir,
      interval: 100,
      depth: 10,
      ignoreInitial: true
    })

    this.chokidar.on('all', (event, name) => {
      logger.info(`${event} ${name}`, { meta: 'underline.white' })
      this.changedFiles.push({
        event: event,
        name: name,
        time: moment().unix()
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
    let current = moment().unix()
    if ((current - latest) <= 10) {
      logger.info('waiting for 10 seconds after the last change...')
      return true
    } else {
      return false
    }
  }

  this.waitForFileChanges = () => {
    return new Promise((resolve, reject) => {
      if (this.timesRestarted === 0) {
        this.timesRestarted += 1
        resolve(true)
        return
      }
      setTimeout(() => {
        if (this.shouldIWait()) {
          logger.info('waiting...')
          resolve(this.waitForFileChanges()) // recursive
        } else {
          logger.info('returning...')
          this.changedFiles = []
          this.timesRestarted += 1
          resolve(true)
        }
      }, 3000)
    })
  }
}

module.exports = watcher
