const fs = require('fs')
const Promise = require('bluebird')

let writeOutput = function (settings, dappId) {
  return new Promise((resolve, reject) => {
    if (settings.output && settings.output.file) {
      let config = {
        host: settings.node.host,
        port: settings.node.port,
        dappId: dappId
      }
      fs.writeFileSync(settings.output.file, JSON.stringify(config, null, 2), 'utf8')
      resolve(true)
      return
    }
    resolve(false)
  })
}

module.exports = writeOutput
