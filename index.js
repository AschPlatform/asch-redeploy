const config = require('config')
const path = require('path')
const watch = require('node-watch')
const deploy = require('./src/deploy')
const aschService = require('./src/asch-service')

// config
let executionDir = path.dirname(require.main.filename)
let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir

console.log(`asch-redploy is executed "${executionDir}`)

watch(executionDir, { recursive: true }, function (evt, name) {
  console.log(`changed: ${name}`)
})

let asch = new aschService(defaultConfig.asch)
console.log(`Starting asch-node in ${defaultConfig.asch}`)
console.log(asch.start())

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

    console.log('needs to restart')
    console.log(asch.restart())

  })
  .catch(function(error) {
    console.log(error)
  })
