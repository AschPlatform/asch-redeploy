
const DI = require('../../src/DI')
const should = require('should')
const mockFs = require('mock-fs')
const fs = require('fs')
const path = require('path')

describe('checkPort', function () {
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
    mockFs.restore()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let checkPublicDistDir = container.get(DI.FILETYPES.CheckPublicDistDir)
      should(checkPublicDistDir).be.ok()
      should(checkPublicDistDir).have.property('config')
      should(checkPublicDistDir).have.property('fs')
      should(checkPublicDistDir).have.property('path')

      done()
    })

    it('create dist directory if not exists', function (done) {
      let Config = {
        node: {
          directory: '/home/user/asch/'
        }
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      mockFs({
        '/home/user/asch/': {
          'public': {
          }
        }
      })

      let checkPublicDistDir = container.get(DI.FILETYPES.CheckPublicDistDir)

      let result = checkPublicDistDir.createIfNotExistsSync()
      let expectedPath = '/home/user/asch/public/dist'
      should(result).equals(true)
      should(fs.existsSync(expectedPath)).equals(true)
      should(fs.lstatSync(expectedPath).isDirectory()).equals(true)

      done()
    })

    it('create dist directory if not exists (relative path)', function (done) {
      let Config = {
        node: {
          directory: '../asch/'
        }
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      mockFs({
        '../asch/': {
          'public': {
          }
        }
      })

      let checkPublicDistDir = container.get(DI.FILETYPES.CheckPublicDistDir)

      let result = checkPublicDistDir.createIfNotExistsSync()

      should(result).equals(true)
      let expectedPath = '../asch/public/dist'
      should(fs.existsSync(expectedPath)).equals(true)
      should(fs.lstatSync(expectedPath).isDirectory()).equals(true)

      done()
    })
  })
})
