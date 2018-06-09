const DI = require('../../src/container')
const should = require('should')

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
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let checkPort = container.get(DI.FILETYPES.CheckPort)
      should(checkPort).be.ok()
      should(checkPort).have.property('config')
      should(checkPort).have.property('isPortAvailable')

      done()
    })

    it('port available - return true', function (done) {
      let IsPortAvailable = function (port) {
        return new Promise((resolve, reject) => {
          resolve(true)
        })
      }
      container.unbind(DI.DEPENDENCIES.IsPortAvailable)
      registerConstant(DI.DEPENDENCIES.IsPortAvailable, IsPortAvailable)

      let checkPort = container.get(DI.FILETYPES.CheckPort)
      checkPort.check()
        .then((result) => {
          should(result).equals(true)
          done()
        })
    })
  })

  describe('sad path', function (done) {
    it('if port is already available - exit with exception', function (done) {
      let IsPortAvailable = function (port) {
        return new Promise((resolve, reject) => {
          resolve(false)
        })
      }
      container.unbind(DI.DEPENDENCIES.IsPortAvailable)
      registerConstant(DI.DEPENDENCIES.IsPortAvailable, IsPortAvailable)

      let checkPort = container.get(DI.FILETYPES.CheckPort)
      checkPort.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('port_in_use')
          done()
        })
    })
  })
})
