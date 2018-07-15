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

    it('no uia object on config object does not execute registerPublisher, registerAsset, createTokens subfunctions', function (done) {
      const Config = {
        dapp: {
          masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix',
          masterAccountPassword2nd: ''
        },
        node: {
          host: 'http://localhost',
          port: '4096'
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      // RegisterPublisher
      const RegisterPublisher = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
          console.log(`called: ${this.called}`)
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      DI.container.unbind(DI.FILETYPES.RegisterPublisher)
      DI.helpers.annotate(RegisterPublisher, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.RegisterPublisher).to(RegisterPublisher)

      // RegisterAsset
      const RegisterAsset = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
        }
      }
      DI.container.unbind(DI.FILETYPES.RegisterAsset)
      DI.helpers.annotate(RegisterAsset, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.RegisterAsset).to(RegisterAsset)

      // CreateTokens
      const CreateTokens = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
        }
      }
      DI.container.unbind(DI.FILETYPES.CreateTokens)
      DI.helpers.annotate(CreateTokens, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.CreateTokens).to(CreateTokens)

      let uia = container.get(DI.FILETYPES.UIA)
      uia.start()
        .then((result) => {
          should(result).equals(true)

          // subfunctions were called
          should(uia.registerPublisher.called).equals(0)
          should(uia.registerAsset.called).equals(0)
          should(uia.createTokens.called).equals(0)

          done()
        })
    })

    it('presence of uia object on config object executes registerPublisher, registerAsset, createTokens subfunctions', function (done) {
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

      // RegisterPublisher
      const RegisterPublisher = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      DI.container.unbind(DI.FILETYPES.RegisterPublisher)
      DI.helpers.annotate(RegisterPublisher, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.RegisterPublisher).to(RegisterPublisher)

      // RegisterAsset
      const RegisterAsset = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      DI.container.unbind(DI.FILETYPES.RegisterAsset)
      DI.helpers.annotate(RegisterAsset, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.RegisterAsset).to(RegisterAsset)

      // CreateTokens
      const CreateTokens = function (config, aschJS, axios, logger, promise) {
        this.called = 0
        this.start = () => {
          this.called++
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      DI.container.unbind(DI.FILETYPES.CreateTokens)
      DI.helpers.annotate(CreateTokens, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.AschJS, DI.DEPENDENCIES.Axios, DI.DEPENDENCIES.Logger, DI.DEPENDENCIES.Promise])
      DI.container.bind(DI.FILETYPES.CreateTokens).to(CreateTokens)

      let uia = container.get(DI.FILETYPES.UIA)
      uia.start()
        .then((result) => {
          should(result).equals(true)

          should(uia.registerPublisher.called).equals(1)
          should(uia.registerAsset.called).equals(1)
          should(uia.createTokens.called).equals(1)

          done()
        })
    })
  })
})
