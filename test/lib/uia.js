'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('uia', function () {
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
      let uia = DI.container.get(DI.FILETYPES.UIA)

      should(uia).be.ok()
      should(uia).have.property('config')
      should(uia).have.property('logger')
      should(uia).have.property('registerPublisher')
      should(uia).have.property('registerAsset')
      should(uia).have.property('createTokens')

      done()
    })

    it('no uia object on config object does not execute registerPublisher, registerAsset, createTokens subfunctions', function () {
    })

    it('precence of uia object on config object executes registerPublisher, registerAsset, createTokens subfunctions')
  })
})
