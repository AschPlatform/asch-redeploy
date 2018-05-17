const config = require('config')
const path = require('path')
const watch = require('node-watch')

let executionDir = path.dirname(require.main.filename)

let defaultConfig = config.get('watch')

console.log(executionDir)
console.log(defaultConfig)

watch(executionDir, { recursive: true }, function (evt, name) {
  console.log(name)
})
