const config = require('config')
const path = require('path')
const watch = require('node-watch')
const deploy = require('./deploy')

// config
let executionDir = path.dirname(require.main.filename)

let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir

console.log(executionDir)
console.log(defaultConfig)

watch(executionDir, { recursive: true }, function (evt, name) {
  console.log(name)
})


// register
let dep = new deploy(defaultConfig)
dep.registerDapp(function (error, transactionId) {
  if (error) {
    console.log(error)
  } else {
    console.log(transactionId)
  }
})

