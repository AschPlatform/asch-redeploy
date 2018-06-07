const DI = require('../../src/container')
const should = require('should')

describe('deploy', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  beforeEach('setup', function () {
    // logger
    const Logger = {
      info (text, config) {
      },
      verbose (text, config) {
      }
    }
    DI.container.unbind(DI.DEPENDENCIES.Logger)
    registerConstant(DI.DEPENDENCIES.Logger, Logger)
  })

  afterEach('cleanup', function () {
    DI.resetConstants()
  })

  describe('happy path', function () {
    it.skip('DI worked')
    it.skip('write delegate secrets to dappDir/config.json file')
    it.skip('copy dappDir to asch/dapps/<dappId>')
  })

  describe('sad path', function () {
    it.skip('called deploy() without dappId throws exception')
    it.skip('no config.json file in userDevDir throw exception')
  })
})
