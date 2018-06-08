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
      container.unbind(DI.DEPENDENCIES.CheckArch)

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

      let CheckArch = function () {
        CheckArch.called = 0
        this.check = () => {
          CheckArch.called += 1
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      registerConstant(DI.DEPENDENCIES.CheckArch, new CheckArch())

      let startUpCheck = container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          should(result).equals(true)

          should(IsConfigValid).have.property('called')
          should(IsConfigValid.called).equals(1)
          should(CheckFileStructure).have.property('called')
          should(CheckFileStructure.called).equals(1)
          should(CheckArch).have.property('called')
          should(CheckArch.called).equals(1)

          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('dependency CheckArch throws Error - startUpCheck exists with error', function (done) {
      // config
      container.unbind(DI.DEPENDENCIES.CheckArch)

      let CheckArch = function () {
        CheckArch.called = 0
        this.check = () => {
          CheckArch.called += 1
          return new Promise((resolve, reject) => {
            reject(new Error('only_linux: This program can currently run only on linux'))
          })
        }
      }
      let checkArch = new CheckArch()
      registerConstant(DI.DEPENDENCIES.CheckArch, checkArch)

      let startUpCheck = container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('only_linux')
          should(CheckArch).have.property('called')
          should(CheckArch.called).equals(1)
          done()
        })
    })

    it('dependency CheckFileStructure throws Error - startUpcheck exits with error', function (done) {
      // every dependency returns true except for "CheckfileStructure" - it throws error
      container.unbind(DI.FILETYPES.IsConfigValid)
      container.unbind(DI.FILETYPES.CheckFileStructure)
      container.unbind(DI.DEPENDENCIES.CheckArch)

      let IsConfigValid = function (config, logger) {
        this.config = config
        this.logger = logger
        this.isValidSync = () => {
          return true
        }
      }
      DI.helpers.annotate(IsConfigValid, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Logger])
      container.bind(DI.FILETYPES.IsConfigValid).to(IsConfigValid)

      let CheckFileStructure = function (config) {
        this.config = config
        this.checkSync = () => {
          throw new Error('file structure error')
        }
      }
      DI.helpers.annotate(CheckFileStructure, [DI.DEPENDENCIES.Config])
      container.bind(DI.FILETYPES.CheckFileStructure).to(CheckFileStructure)

      let CheckArch = function () {
        this.check = () => {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      registerConstant(DI.DEPENDENCIES.CheckArch, new CheckArch())

      let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('file structure error')
          done()
        })
    })

    it('dependency IsConfigValid throws Error - startUpcheck exits with error', function (done) {
      // every dependency returns true except for "IsConfigValid"" - it throws error
      container.unbind(DI.FILETYPES.IsConfigValid)
      container.unbind(DI.FILETYPES.CheckFileStructure)
      container.unbind(DI.DEPENDENCIES.CheckArch)

      let IsConfigValid = function (config, logger) {
        this.config = config
        this.logger = logger
        this.isValidSync = () => {
          throw new Error('config not valid')
        }
      }
      DI.helpers.annotate(IsConfigValid, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Logger])
      container.bind(DI.FILETYPES.IsConfigValid).to(IsConfigValid)

      let CheckFileStructure = function (config) {
        this.config = config
        this.checkSync = () => {
          return true
        }
      }
      DI.helpers.annotate(CheckFileStructure, [DI.DEPENDENCIES.Config])
      container.bind(DI.FILETYPES.CheckFileStructure).to(CheckFileStructure)

      let CheckArch = function () {
        this.check = () => {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      registerConstant(DI.DEPENDENCIES.CheckArch, new CheckArch())

      let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('config not valid')
          done()
        })
    })
  })
})
