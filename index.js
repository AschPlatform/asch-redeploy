const path = require('path')
process.env["NODE_CONFIG_DIR"] = path.join(__dirname, "config")
const config = require('config')
const shelljs = require('shelljs')

const watch = require('node-watch')
const deploy = require('./src/deploy')
const aschService = require('./src/asch-service')


process.on('SIGTERM', function () {
  console.log('Trying to shut down asch-redeploy...')
  console.log(asch.status())
  proccess.exit()
})
process.on('SIGINT', function () {
  console.log('Trying to shut down asch-redeploy...')
  console.log(asch.stop())
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
console.log(asch.stop())
console.log(asch.start())

let dep = new deploy(defaultConfig)

dep.sendMoney()
  .then(function sendMoneyFinished(response) {
    if (response.status !== 200) {
      throw new Error('Could not send money')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    console.log(`successful created money transaction: ${response.data.transactionId}`)
    return dep.registerDapp()
  })
  dep.registerDapp()
  .then(function registerDappFinished(response) {
    if (response.status !== 200) {
      throw new Error('Could not register dapp')
    }
    if (response.data.success === false) {
      throw new Error(response.data.error)
    }
    console.log(`DAPP registered, DappId: ${response.data.transactionId}`)
    return dep.copyFiles(response.data.transactionId)
  })
  .then(function copyingFilesFinished(result) {

    console.log('needs to restart')
    console.log(asch.restart())
    console.log("SUCCESS")
  })
  .catch(function errorOccured(error) {
    console.log('ERROR OCCURED')
    console.log(error.message)
  })
