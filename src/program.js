const program = require('commander')

let version = require('../package.json').version
program
  .version(version)
  .option('-a, --asch <path>', 'Path to Asch directory, default "../asch"')
  .option('-h, --host <host>', 'Host name, default "localhost"')
  .option('-p, --port <port>', 'Port nuber, default "4096"')
  .option('--magic <magic>', 'Http-Header "Magic", default "594fe0f3"')
  .option('-g, --genesis <secret>', 'The secret of the respective genesis account')

  .option('-m, --master <secret>', 'The master secret with which the Dapp should be registered with')
  .option('-2, --master2 <secret>', 'The 2nd master secret with which the Dapp should be registered with')
  .option('-d, --delegates <del>', 'An array of delegate secrets with which the Dapp should be registered with. Delegates must be provided comma separated "secret_1,secret_2,secret3"', function (del) {
    let delegates = del.split(',').map((x) => x.replace(/^\s+|\s+$/g, ''))
    return delegates
  })

  .option('-o, --output <file>', 'File in which the <dapp Id> of the registered Dapp will be saved')

  .option('--publisher <publisher>', 'Register this publisher')
  .option('--asset <asset>', 'Register asset')

  .parse(process.argv)

let pr = {
  getUserInput: function () {
    let config = {}

    /* config.dapp */
    let createDappProperty = function () {
      if (!config.hasOwnProperty('dapp')) {
        config.dapp = {}
      }
    }
    if (program.master) {
      createDappProperty()
      config.dapp.master = program.master
    }
    if (program.master2) {
      createDappProperty()
      config.dapp.masterAccountPassword2nd = program.master2
    }
    if (program.delegates) {
      createDappProperty()
      config.dapp.delegates = program.delegates
    }

    /* config.node */
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
    if (program.magic) {
      createNodeProperty()
      config.node.magic = program.magic
    }
    if (program.genesis) {
      createNodeProperty()
      config.node.genesisAccount = program.genesis
    }

    /* config.output */
    if (program.output) {
      config.output = {}
      config.output.file = program.output
    }

    /* config.uia */
    let createUIAProperty = function () {
      if (!config.hasOwnProperty('uia')) {
        config.uia = {}
      }
    }
    if (program.publisher) {
      createUIAProperty()
      config.uia.publisher = program.publisher

      if (!program.asset) {
        console.log('the --asset option must be also provided')
        process.exit(0)
      }
    }
    if (program.asset) {
      createUIAProperty()
      config.uia.asset = program.asset

      if (!program.publisher) {
        console.log('the --publisher option must be also provided')
        process.exit(0)
      }
    }

    return config
  }
}

module.exports = pr
