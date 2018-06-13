'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('startUpCheck', function () {
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
      should(startUpCheck).have.property('checkPublicDistDir')
      done()
    })

    it('dependencies getting called and overall result is true', function (done) {
      container.unbind(DI.FILETYPES.IsConfigValid)
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

      container.unbind(DI.FILETYPES.CheckFileStructure)
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

      container.unbind(DI.DEPENDENCIES.CheckArch)
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

      container.unbind(DI.FILETYPES.CheckPublicDistDir)
      let CheckPublicDistDir = function (config, fs, path) {
        this.config = config
        this.fs = fs
        this.path = path
        CheckPublicDistDir.called = 0
        this.createIfNotExistsSync = () => {
          CheckPublicDistDir.called += 1
        }
      }
      DI.helpers.annotate(CheckPublicDistDir, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Fs, DI.DEPENDENCIES.Path])
      container.bind(DI.FILETYPES.CheckPublicDistDir).to(CheckPublicDistDir)

      container.unbind(DI.FILETYPES.CheckPort)
      let CheckPort = function (config, isPortAvailable) {
        this.config = config
        this.isPortAvailable = isPortAvailable
        CheckPort.called = 0
        this.check = () => {
          return new Promise((resolve, reject) => {
            CheckPort.called += 1
            resolve(true)
          })
        }
      }
      DI.helpers.annotate(CheckPort, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.IsPortAvailable])
      container.bind(DI.FILETYPES.CheckPort).to(CheckPort)

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

          should(CheckPort).have.property('called')
          should(CheckPort.called).equals(1)

          should(CheckPublicDistDir).have.property('called')
          should(CheckPublicDistDir.called).equals(1)

          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    // helper function
    let dummyCheckArch = function () {
      container.unbind(DI.DEPENDENCIES.CheckArch)
      let CheckArch = function () {
        this.check = () => {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      registerConstant(DI.DEPENDENCIES.CheckArch, new CheckArch())
    }

    let dummyIsConfigValid = function () {
      container.unbind(DI.FILETYPES.IsConfigValid)

      let IsConfigValid = function (config, logger) {
        this.config = config
        this.logger = logger
        this.isValidSync = () => {
          return true
        }
      }
      DI.helpers.annotate(IsConfigValid, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Logger])
      container.bind(DI.FILETYPES.IsConfigValid).to(IsConfigValid)
    }

    let dummyCheckFileStructure = function () {
      container.unbind(DI.FILETYPES.CheckFileStructure)

      let CheckFileStructure = function (config) {
        this.config = config
        this.checkSync = () => {
          return true
        }
      }
      DI.helpers.annotate(CheckFileStructure, [DI.DEPENDENCIES.Config])
      container.bind(DI.FILETYPES.CheckFileStructure).to(CheckFileStructure)
    }

    let dummyCheckPort = function () {
      container.unbind(DI.FILETYPES.CheckPort)
      let CheckPort = function (config, isPortAvailable) {
        this.config = config
        this.isPortAvailable = isPortAvailable

        this.check = () => {
          return new Promise((resolve, reject) => {
            resolve(true)
          })
        }
      }
      DI.helpers.annotate(CheckPort, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.IsPortAvailable])
      container.bind(DI.FILETYPES.CheckPort).to(CheckPort)
    }

    let dummyCheckPublicDistDir = function () {
      container.unbind(DI.FILETYPES.CheckPublicDistDir)
      let CheckPublicDistDir = function (config, fs, path) {
        this.config = config
        this.fs = fs
        this.path = path

        this.createIfNotExistsSync = () => {
          return true
        }
      }
      DI.helpers.annotate(CheckPublicDistDir, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Fs, DI.DEPENDENCIES.Path])
      container.bind(DI.FILETYPES.CheckPublicDistDir).to(CheckPublicDistDir)
    }

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

      dummyCheckFileStructure()
      dummyIsConfigValid()
      dummyCheckPort()
      dummyCheckPublicDistDir()

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
      container.unbind(DI.FILETYPES.CheckFileStructure)
      let CheckFileStructure = function (config) {
        this.config = config
        this.checkSync = () => {
          throw new Error('file structure error')
        }
      }
      DI.helpers.annotate(CheckFileStructure, [DI.DEPENDENCIES.Config])
      container.bind(DI.FILETYPES.CheckFileStructure).to(CheckFileStructure)

      dummyCheckArch()
      dummyIsConfigValid()
      dummyCheckPort()
      dummyCheckPublicDistDir()

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
      let IsConfigValid = function (config, logger) {
        this.config = config
        this.logger = logger
        this.isValidSync = () => {
          throw new Error('config not valid')
        }
      }
      DI.helpers.annotate(IsConfigValid, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Logger])
      container.bind(DI.FILETYPES.IsConfigValid).to(IsConfigValid)

      dummyCheckArch()
      dummyCheckFileStructure()
      dummyCheckPort()
      dummyCheckPublicDistDir()

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

    it('dependency CheckPort throws Error - startUpcheck exits with error', function (done) {
      // every dependency returns true except for "CheckPort"" - it throws error
      container.unbind(DI.FILETYPES.CheckPort)
      let CheckPort = function (config, isPortAvailable) {
        this.config = config
        this.isPortAvailable = isPortAvailable
        this.check = () => {
          return new Promise((resolve, reject) => {
            reject(new Error('port_in_use'))
          })
        }
      }
      DI.helpers.annotate(CheckPort, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.IsPortAvailable])
      container.bind(DI.FILETYPES.CheckPort).to(CheckPort)

      dummyCheckArch()
      dummyIsConfigValid()
      dummyCheckFileStructure()
      dummyCheckPublicDistDir()

      let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('port_in_use')
          done()
        })
    })

    it('dependency checkPublicDistDir throws Error - startUpCheck exits with error', function (done) {
      // every dependency returns true except for "checkPublicDistDir - it throws error
      container.unbind(DI.FILETYPES.CheckPublicDistDir)
      let CheckPublicDistDir = function () {
        this.createIfNotExistsSync = () => {
          throw new Error('can_not_create_dir')
        }
      }
      DI.helpers.annotate(CheckPublicDistDir, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Fs, DI.DEPENDENCIES.Path])
      container.bind(DI.FILETYPES.CheckPublicDistDir).to(CheckPublicDistDir)

      dummyCheckArch()
      dummyIsConfigValid()
      dummyCheckFileStructure()
      dummyCheckPort()

      let startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)
      startUpCheck.check()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('can_not_create_dir')
          done()
        })
    })
  })
})
