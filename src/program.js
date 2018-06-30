const program = require('commander')

let version = '1.0.2'
program
  .version(version)
  .option('-a, --asch <path>', 'Path to Asch directory')
  .option('-h, --host <host>', 'Host name, default "localhost"')
  .option('-p, --port <port>', 'Port nuber, default 4096')
  .parse(process.argv)

let pr = {
  getUserInput: function () {
    let config = {}

    let createNodeProperty = function () {
      if (!config.hasOwnProperty('node')) {
        config.node = {}
      }
    }

    if (program.asch) {
      createNodeProperty()
      config.node.directory = program.asch
    }
    if (program.host) {
      createNodeProperty()
      config.node.host = program.host
    }
    if (program.port) {
      createNodeProperty()
      config.node.port = program.port
    }

    return config
  }
}

module.exports = pr
