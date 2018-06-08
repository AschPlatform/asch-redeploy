'use strict'

const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')
const path = require('path')
const fs = require('fs')

describe('startUpcheck', function () {
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
      let result = createLogDir.createSync()

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
      let result = createLogDir.createSync()

      let expectedPath = path.join('../hello', 'logs')

      should(expectedPath).equals(result)
      should(fs.existsSync(expectedPath)).equals(true)
      done()
    })
  })
})
