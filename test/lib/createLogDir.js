'use strict'

const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

describe('createLogDir', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  afterEach('cleanup', function () {
    DI.resetConstants()
    mockFs.restore()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let startUpCheck = container.get(DI.FILETYPES.CreateLogDir)
      should(startUpCheck).be.ok()
      should(startUpCheck).have.property('config')
      should(startUpCheck).have.property('fs')
      should(startUpCheck).have.property('path')
      should(startUpCheck).have.property('moment')
      done()
    })

    it('log directory gets created if not exists', function (done) {
      // config
      let Config = {
        userDevDir: '/home/user/hello'
      }
      DI.container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      // create empty dir
      mockFs({
        '/home/user/hello': {
        }
      })

      let createLogDir = container.get(DI.FILETYPES.CreateLogDir)
      let result = createLogDir.createDirSync()

      let expectedPath = path.join('/home/user/hello', 'logs')

      should(expectedPath).equals(result)
      should(fs.existsSync(expectedPath)).equals(true)
      done()
    })

    it('log directory gets created if not exists (with relative path)', function (done) {
      // config
      let Config = {
        userDevDir: '../hello'
      }
      DI.container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      // create empty dir
      mockFs({
        '../hello': {
        }
      })

      let createLogDir = container.get(DI.FILETYPES.CreateLogDir)
      let result = createLogDir.createDirSync()

      let expectedPath = path.join('../hello', 'logs')

      should(expectedPath).equals(result)
      should(fs.existsSync(expectedPath)).equals(true)
      done()
    })

    it('create daily asch-node log file and return file handle', function (done) {
      let Moment = function () {
        return moment.utc('2018-01-01T01:00:00')
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      mockFs({
        '/home/user/logs': {
        }
      })

      let createLogDir = container.get(DI.FILETYPES.CreateLogDir)
      let fileDescriptor = createLogDir.createLogFileNameHandleSync('/home/user/logs')

      fs.writeSync(fileDescriptor, 'ending', 0, 'utf8')
      fs.closeSync(fileDescriptor)

      let logFile = path.join('/home/user/logs', `asch-node-2018-01-01.log`)

      should(fs.existsSync(logFile)).equals(true)
      should(fs.readFileSync(logFile, 'utf8')).endWith('ending')
      done()
    })

    it('append to existing daily asch-node log file and return handle', function (done) {
      let Moment = function () {
        return moment.utc('2016-01-01T01:00:00')
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      mockFs({
        '/home/user/logs': {
          'asch-node-2016-01-01.log': 'first line\n'
        }
      })

      let createLogDir = container.get(DI.FILETYPES.CreateLogDir)
      let fileDescriptor = createLogDir.createLogFileNameHandleSync('/home/user/logs')

      fs.writeSync(fileDescriptor, 'second line\n')
      fs.closeSync(fileDescriptor)

      let logFile = path.join('/home/user/logs', `asch-node-2016-01-01.log`)

      should(fs.existsSync(logFile))
      should(fs.readFileSync(logFile, 'utf8')).equals('first line\nsecond line\n')
      done()
    })
  })
})
