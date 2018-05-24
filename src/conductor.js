
// ctor
let Conductor = function (service, config) {
  this.service = service
  this.config = config

  this.inProgress = false
  this.pendingTasks = []

  this.orchestrate = function () {
    
  }
}

module.exports = Conductor
