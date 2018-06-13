
const DI = require('../../src/DI')
const should = require('should')
const mockFs = require('mock-fs')

describe('checkPort', function () {
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
    mockFs.restore()
  })

  describe('happy path', function () {
    it.skip('DI worked', function (done) {
      let checkPort = container.get(DI.FILETYPES.CheckPublicDistDir)
      should(checkPort).be.ok()
      should(checkPort).have.property('config')
      should(checkPort).have.property('isPortAvailable')

      done()
    })
  })
})
