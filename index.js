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
  console.log(name)
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

    let pathToService = path.join(defaultConfig.asch, 'aschd')
    let svc = new Service({
      name:'Asch Service',
      script: pathToService
    })

    svc.on('alreadyinstalled', function (){

    })
    svc.on('start', function () {

    })
    svc.on('stop', function () {

    })
    svc.on('doesnotexist', function () {

    })


  })
  .catch(function(error) {
    console.log(error)
  })
