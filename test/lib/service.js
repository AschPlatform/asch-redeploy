const DI = require('../../src/DI')
const should = require('should')
const mockFs = require('mock-fs')
const EventEmitter = require('events')

describe('service', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  beforeEach('setup', function () {
    // logger
    const Logger = {
      info (text, config) {
      },
      verbose (text, config) {
      },
      warn (test, config) {
      },
      error (text, config) {
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
    it('DI worked', function (done) {
      let service = container.get(DI.FILETYPES.Service)
      should(service).be.ok()
      should(service).have.property('config')
      should(service).have.property('logger')
      should(service).have.property('moment')
      should(service).have.property('path')
      should(service).have.property('fs')
      should(service).have.property('EventEmitter')
      should(service).have.property('createLogDir')
      should(service).have.property('fork')
      should(service).have.property('pathResolution')

      done()
    })

    it('service forks new process that writes to log file', function (done) {
      mockFs({
        '/home/user/asch': {
          'app.js': 'write_to_appjs'
        },
        '/home/user/dapp': {
          'logs': {}
        }
      })

      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let CreateLogDir = function (config, fs, path, moment) {
        this.config = config
        this.fs = fs
        this.path = path
        this.moment = moment

        CreateLogDir.createdLogDir = false
        CreateLogDir.returnedFileDescriptor = false

        this.createDirSync = () => {
          CreateLogDir.createdLogDir = true
          return '/home/user/dapp/logs'
        }
        this.createLogFileNameHandleSync = (logDir) => {
          CreateLogDir.returnedFileDescriptor = true
          return 'asch-node-2017-01-01.log'
        }
      }
      container.unbind(DI.FILETYPES.CreateLogDir)
      DI.helpers.annotate(CreateLogDir, [DI.DEPENDENCIES.Config, DI.DEPENDENCIES.Fs, DI.DEPENDENCIES.Path, DI.DEPENDENCIES.Moment])
      container.bind(DI.FILETYPES.CreateLogDir).to(CreateLogDir)

      let Fork = (path, args, option) => {
        return new EventEmitter()
      }
      container.unbind(DI.DEPENDENCIES.Fork)
      registerConstant(DI.DEPENDENCIES.Fork, Fork)

      // overwrite
      let service = container.get(DI.FILETYPES.Service)
      service.start()
        .then((result) => {
          should(CreateLogDir).have.property('createdLogDir')
          should(CreateLogDir.createdLogDir).equals(true)
          should(CreateLogDir).have.property('returnedFileDescriptor')
          should(CreateLogDir.returnedFileDescriptor).equals(true)

          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it('stopping service kills forked process and sends SIGTERM to forked process', function (done) {
      mockFs({
        '/home/user/asch': {
          'app.js': 'write_to_appjs'
        },
        '/home/user/dapp': {
          'logs': {}
        }
      })

      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let Fork = (path, args, option) => {
        Fork.killed = false
        Fork.killVerb = ''
        Fork.called = 0

        let eventEmitter = new EventEmitter()
        eventEmitter.kill = function (verb) {
          Fork.killed = true
          Fork.killVerb = verb
          Fork.called += 1
        }
        return eventEmitter
      }
      container.unbind(DI.DEPENDENCIES.Fork)
      registerConstant(DI.DEPENDENCIES.Fork, Fork)

      let service = container.get(DI.FILETYPES.Service)
      service.start()
        .then(() => {
          return service.stop()
        })
        .then((result) => {
          should(Fork).have.property('killed')
          should(Fork.killed).equals(true)

          should(Fork).have.property('killVerb')
          should(Fork.killVerb).equals('SIGTERM')

          should(Fork).have.property('called')
          should(Fork.called).equals(1)

          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it('stopping service emits exit with exit code', function (done) {
      let exitCode = 1

      mockFs({
        '/home/user/asch': {
          'app.js': 'write_to_appjs'
        },
        '/home/user/dapp': {
          'logs': {}
        }
      })

      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let Fork = (path, args, option) => {
        let eventEmitter = new EventEmitter()
        eventEmitter.kill = function (verb) {
          eventEmitter.emit('exit', exitCode)
        }
        return eventEmitter
      }
      container.unbind(DI.DEPENDENCIES.Fork)
      registerConstant(DI.DEPENDENCIES.Fork, Fork)

      let service = container.get(DI.FILETYPES.Service)

      service.notifier.on('exit', function (code) {
        should(code).equals(exitCode)
        done()
      })

      service.start()
        .then(() => {
          return service.stop()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('call stop() without start() throws exception', function (done) {
      let service = container.get(DI.FILETYPES.Service)
      service.stop()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('no_process_started')
          done()
        })
    })

    it('call start() stop() and again stop() should throw exception', function (done) {
      mockFs({
        '/home/user/asch': {
          'app.js': 'write_to_appjs'
        },
        '/home/user/dapp': {
          'logs': {}
        }
      })

      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let Fork = (path, args, option) => {
        let eventEmitter = new EventEmitter()
        Fork.killedTimes = 0
        eventEmitter.kill = function () {
          Fork.killedTimes += 1
          eventEmitter.emit('exit', 1)
        }
        return eventEmitter
      }
      container.unbind(DI.DEPENDENCIES.Fork)
      registerConstant(DI.DEPENDENCIES.Fork, Fork)

      let service = container.get(DI.FILETYPES.Service)
      service.start()
        .then(() => {
          return service.stop()
        })
        .then(() => {
          return service.stop()
        })
        .then(() => {
          throw new Error('shouldnt come to here')
        })
        .catch((error) => {
          should(error.message).startWith('no_process_started')

          should(Fork).have.property('killedTimes')
          should(Fork.killedTimes).equals(1)
          done()
        })
    })
  })
})
