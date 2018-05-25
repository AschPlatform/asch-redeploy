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
        return this.orchestrate()
      })
  }
}

module.exports = Conductor
