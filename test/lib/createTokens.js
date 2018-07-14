'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('createTokens', function () {
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

    const Config = {
      dapp: {
        masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix',
        masterAccountPassword2nd: ''
      },
      node: {
        host: 'http://localhost',
        port: '4096'
      },
      uia: {
        publisher: 'CCTime',
        asset: 'XCT'
      }
    }
    DI.container.unbind(DI.DEPENDENCIES.Config)
    registerConstant(DI.DEPENDENCIES.Config, Config)
  })

  afterEach('cleanup', function () {
    DI.resetConstants()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let createTokens = DI.container.get(DI.FILETYPES.CreateTokens)

      should(createTokens).be.ok()
      should(createTokens).have.property('config')
      should(createTokens).have.property('aschJS')
      should(createTokens).have.property('axios')
      should(createTokens).have.property('logger')
      should(createTokens).have.property('promise')
      done()
    })
  })
})
