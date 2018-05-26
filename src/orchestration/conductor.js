const Promise = require('bluebird')
const chalk = require('chalk')
const workflow = require('./workflow')
const Watcher = require('./watcher')
const log = console.log

// ctor
let Conductor = function (service, config) {
  this.service = service
  this.config = config

  this.pendingTasks = []
  this.timesRestarted = 0

  let watcher = new Watcher(config)
  watcher.watch()
  this.notifier = watcher.notifier

  this.notifier.on('fileChanged', () => {
    log(chalk.magenta('received filechanged!'))
    this.pendingTasks.push('change')
  })

  // recursive
  this.waiting = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.pendingTasks.length === 0) {
          resolve(this.waiting())
        } else {
          console.log('start to orchestrate()')
          log(chalk.green('pending Tasks'))
          console.log(this.pendingTasks)
          this.pendingTasks = []
          resolve(this.orchestrate())
        }
      }, 3000)
    })
  }

  this.orchestrate = () => {
    return new Promise((resolve, reject) => {

      if (this.timesRestarted === 0) {
        this.pendingTasks = []
      }
      this.timesRestarted++
      console.log(chalk.yellow(`times Restarted ${this.timesRestarted}`))
      resolve(workflow(this.service, this.config))
    })
      .then(() => {
        log(chalk.magenta('sleep for 3sec'))
        return Promise.delay(3000)
      })
      .catch((error) => {
        throw error
      })
      .then(() => {
        console.log('waiting for file changes...')
        return this.waiting()
      })
  }
}

module.exports = Conductor
