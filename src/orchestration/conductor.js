const Promise = require('bluebird')
const workflow = require('./workflow')
const Watcher = require('./watcher')
const logger = require('../logger')

// ctor
let Conductor = function (service, config) {
  this.service = service
  this.config = config

  this.pendingTasks = []
  this.timesRestarted = 0

  let watcher = new Watcher(config)
  watcher.watch()
  this.notifier = watcher.notify

  this.notifier.on('changed', (data) => {
    logger.info(`${data.name} has been "${data.event}"`, { meta: 'green.inverse' })
    if (this.timesRestarted > 0) {
      this.pendingTasks.push(data)
    }
  })

  // recursive
  this.waiting = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.pendingTasks.length === 0) {
          resolve(this.waiting()) // recursive
        } else {
          logger.silly('start to orchestrate()')
          this.pendingTasks = []
          resolve(this.orchestrate())
        }
      }, 3000)
    })
  }

  this.orchestrate = () => {
    return Promise.delay(3000)
      .then(() => {
        return new Promise((resolve, reject) => {
          logger.verbose('orchestrate()')

          if (this.timesRestarted === 0) {
            logger.verbose('clearing pending tasks!')
            this.pendingTasks = []
          }
          logger.verbose(`Times restarted ${this.timesRestarted}`)
          this.timesRestarted++
          resolve(workflow(this.service, this.config))
        })
      })
      .then(() => {
        let ms = 3000
        logger.verbose(`sleep for ${ms}ms`)
        return Promise.delay(ms)
      })
      .catch((error) => {
        throw error
      })
      .then(() => {
        logger.info('waiting for file changes...')
        return this.waiting()
      })
  }
}

module.exports = Conductor
