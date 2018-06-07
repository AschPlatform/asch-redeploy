'use strict'

const DI = require('../../src/container')
const should = require('should')

describe('startUpcheck', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  afterEach('cleanup', function () {
    DI.resetConstants()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let startUpCheck = container.get(DI.FILETYPES.StartUpCheck)
      should(startUpCheck).be.ok()
      should(startUpCheck).have.property('config')
      should(startUpCheck).have.property('isConfigValid')
      should(startUpCheck).have.property('checkFileStructure')
      done()
    })

    it('dependencies getting called and overall result is true', function (done) {
      container.unbind(DI.FILETYPES.IsConfigValid)
      container.unbind(DI.FILETYPES.CheckFileStructure)

      let IsConfigValid = function (config, logger) {
        this.config = config
        this.logger = logger
        IsConfigValid.called = 0
        this.isValidSync = () => {
          IsConfigValid.called += 1
          return true
        }
      }
      DI.helpers.annotate(IsConfigValid, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Logger])
      container.bind(DI.FILETYPES.IsConfigValid).to(IsConfigValid)

      let CheckFileStructure = function (config) {
        this.config = config
        CheckFileStructure.called = 0
        this.checkSync = () => {
          CheckFileStructure.called += 1
          return true
        }
      }
      DI.helpers.annotate(CheckFileStructure, [DI.DEPENDENCIES.Config])
      container.bind(DI.FILETYPES.CheckFileStructure).to(CheckFileStructure)

      let startUpCheck = container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          should(result).equals(true)
          should(IsConfigValid).have.property('called')
          should(IsConfigValid.called).equals(1)
          should(CheckFileStructure).have.property('called')
          should(CheckFileStructure.called).equals(1)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
  })
})
