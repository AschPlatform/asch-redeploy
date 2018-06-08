const DI = require('../../src/container')
const should = require('should')
const path = require('path')
const mockFs = require('mock-fs')
const fs = require('fs')

describe('deploy', function () {
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
      let startUpCheck = container.get(DI.FILETYPES.Deploy)
      should(startUpCheck).be.ok()
      should(startUpCheck).have.property('config')
      should(startUpCheck).have.property('copyDirectory')
      should(startUpCheck).have.property('path')
      should(startUpCheck).have.property('fs')
      done()
    })

    it('copy files from current dir to asch/dapps/<dappId>', function (done) {
      // config
      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/source'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      mockFs({
        '/home/user': {
          'asch': {},
          'source': {
            'contract': {
              'contract.js': 'contract'
            },
            'model': {
              'domain.js': 'domain'
            },
            'init.js': 'init'
          }
        }
      })

      let dappId = 'q45g9j34ro3gsgn3opfgn'
      // targetDirectory
      let expectedTargetDirectory = path.join('/home/user/asch', 'dapps', dappId)

      let startUpCheck = container.get(DI.FILETYPES.Deploy)
      startUpCheck.deploy(dappId)
        .then((result) => {
          should(result).equals(dappId)

          should(fs.existsSync(expectedTargetDirectory)).equals(true)

          let initFile = path.join(expectedTargetDirectory, 'init.js')
          should(fs.existsSync(initFile)).equals(true)
          should(fs.readFileSync(initFile, 'utf8')).equals('init')

          let contractFile = path.join(expectedTargetDirectory, 'contract', 'contract.js')
          should(fs.existsSync(contractFile)).equals(true)
          should(fs.readFileSync(contractFile, 'utf8')).equals('contract')

          let modelFile = path.join(expectedTargetDirectory, 'model', 'domain.js')
          should(fs.existsSync(modelFile))
          should(fs.readFileSync(modelFile, 'utf8')).equals('domain')

          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('called deploy() without dappId throws exception', function (done) {
      let startUpCheck = container.get(DI.FILETYPES.Deploy)
      startUpCheck.deploy(null)
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('dappId must be of type string')
          done()
        })
    })
  })
})
