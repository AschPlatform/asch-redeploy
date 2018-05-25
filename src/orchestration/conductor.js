const Promise = require('bluebird')
const chalk = require('chalk')
const workflow = require('./workflow')
const log = console.log

// ctor
let Conductor = function (service, config) {
  this.service = service
  this.config = config

  this.taskInProgress = false
  this.pendingTasks = []

  this.getLatestTask = () => {
    let newTask = this.pendingTasks.pop()
    this.pendingTasks = []
    return newTask
  }

  this.waiting = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('waited for 3000ms')
        if (this.pendingTasks.length === 0) {
          console.log('waiting()')
          resolve(this.waiting())
        } else {
          console.log('orchestrat()')
          resolve(this.orchestrate())
        }
      }, 3000)
    })
  }

  this.orchestrate = () => {
    return new Promise((resolve, reject) => {
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
        console.log('calling waiting() for the first time')
        return this.waiting()
      })
  }
}

module.exports = Conductor
