const config = require('config')
const path = require('path')
const watch = require('node-watch')
const deploy = require('./deploy')
var Service = require('node-linux').Service;

// config
let executionDir = path.dirname(require.main.filename)

let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir

console.log(executionDir)
console.log(defaultConfig)

watch(executionDir, { recursive: true }, function (evt, name) {
  console.log(`changed: ${name}`)
})

// register
let dep = new deploy(defaultConfig)

dep.registerDapp()
  .then(function (response) {
    if (response.status !== 200) {
      throw new Error('Could not register dapp')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    console.log(`dappId: ${response.data.transactionId}`)
    return dep.copyFiles(response.data.transactionId)
  })
  .then(function (result) {

    let pathToService = path.join(defaultConfig.asch, 'app.js')
    let svc = new Service({
      name:'Asch Service',
      script: pathToService
    })
    
    svc.install()

    svc.on('install', function () {
      console.log('install')
      svc.stop()
    })

    svc.on('alreadyinstalled', function (){
      console.log('alreadyinstalled')
      svc.stop()
    })
    svc.on('start', function () {
      console.log('start')
    })
    svc.on('stop', function () {
      console.log('stop')
    })
    svc.on('doesnotexist', function () {
      console.log('doesnotexist')
    })
  })
  .catch(function(error) {
    console.log(error)
  })
