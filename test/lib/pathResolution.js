const DI = require('../../src/DI')
const should = require('should')

describe('pathResolution', function () {
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

  describe('happy path', function () {
    it('DI worked', function (done) {
      const pathResolution = container.get(DI.FILETYPES.PathResolution)
      should(pathResolution).be.ok()
      should(pathResolution).have.property('config')
      should(pathResolution).have.property('logger')
      should(pathResolution).have.property('path')

      done()
    })

    it('ASCH_NODE_DIR absolute path (/home/user/test/asch) returns same absolute path', function (done) {
      let Config = {
        node: {
          directory: '/home/user/test/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      const pathResolution = container.get(DI.FILETYPES.PathResolution)
      let result = pathResolution.getAbsoluteAschPathSync()

      should(result).equals('/home/user/test/asch')
      done()
    })

    it('ASCH_NODE_DIR relative path ("../../asch") returns correct absolute path', function (done) {
      let aschAbsolutePath = '/home/user/test/asch'

      let Config = {
        node: {
          directory: '../test/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      const pathResolution = container.get(DI.FILETYPES.PathResolution)
      let result = pathResolution.getAbsoluteAschPathSync()

      should(result).deepEqual(aschAbsolutePath)
      done()
    })

    it('ASCH_NODE_DIR relative path ("./asch") in same directory returns correct absolute path', function (done) {
      let aschAbsolutePath = '/home/user/dapp/asch'

      let Config = {
        node: {
          directory: './asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      const pathResolution = container.get(DI.FILETYPES.PathResolution)
      let result = pathResolution.getAbsoluteAschPathSync()

      should(result).deepEqual(aschAbsolutePath)
      done()
    })
  })

  describe('sad path', function () {
    it('throws exception on if asch-node is not absolute or relative path', function (done) {
      let Config = {
        node: {
          directory: 'someDirectory'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      const pathResolution = container.get(DI.FILETYPES.PathResolution)
      try {
        pathResolution.getAbsoluteAschPathSync()
      } catch (error) {
        should(error.message).startWith('asch_node_not_found')
        done()
      }

      throw new Error('should throw exception')
    })
  })
})
