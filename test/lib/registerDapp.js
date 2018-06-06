'use strict'

const DI = require('../../src/container')
const should = require('should')

describe('registerDapp', function () {
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
      let registerDapp = container.get(DI.FILETYPES.RegisterDapp)
      should(registerDapp).be.ok()
      done()
    })

    it.skip('calls localnet endpoint for dapp registration', function (done) {
    })
  })

  describe('sad path', function () {
  })
})
