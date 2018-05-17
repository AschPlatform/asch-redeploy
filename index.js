const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const config = require('config')
const shelljs = require('shelljs')

const watch = require('node-watch')
const deploy = require('./src/deploy')
const aschService = require('./src/asch-service')


process.on('SIGTERM', function () {
  'Shutting down asch-redeploy...'
  asch.stop()
  proccess.exit()
})
process.on('SIGINT', function () {
  'Shutting down asch-redeploy...'
  asch.stop()
  process.exit()
})



// config
let executionDir = shelljs.pwd().stdout
let defaultConfig = config.get('config')
defaultConfig.executionDir = executionDir

console.log(`asch-redploy is executed "${executionDir}"`)

watch(executionDir, { recursive: true }, function (evt, name) {
  console.log(`changed: ${name}`)
})

let asch = new aschService(defaultConfig.asch)
console.log(`Starting asch-node in ${defaultConfig.asch}`)
console.log(asch.start())

let dep = new deploy(defaultConfig)

dep.sendMoney()
  .then(function (result) {
    return dep.registerDapp()
  })
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
    console.log(`result: ${result}`)
  })
  .catch(function(error) {
    console.log(error)
  })

