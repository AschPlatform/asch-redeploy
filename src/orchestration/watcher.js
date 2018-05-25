const watch = require('node-watch')

// ctor
function watcher (userDevDir) {
  this.userDevDir = userDevDir

  this.watch = function () {
    watch(this.executionDir, { recursive: true }, function (event, name) {
      console.log(`changed: ${name}`)
    })
  }
}

module.exports = watcher
