const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')
const fs = require('fs')
const path = require('path')

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

      done()
    })

    it('service forks new process that writes to log file', function (done) {
      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        userDevDir: '/home/user/dapp'
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      mockFs({
        '/home/user/asch': {
          'app.js': 'console.error("write_to_appjs")'
        },
        '/home/user/dapp': {
          'logs': {}
        }
      })

      // overwrite
      let service = container.get(DI.FILETYPES.Service)
      service.start()
        .then((result) => {
          console.log(result)

          let expectedLogFile = path.join('/home/user/dapp', 'logs', 'asch-node-2018-06-08.log')
          should(fs.existsSync(expectedLogFile)).equals(true)
          let content = fs.readFileSync(expectedLogFile, 'utf8')
          console.log(fs.readFileSync('/home/user/asch/app.js', 'utf8'))

          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it.skip('stopping service emits exit event')
    it.skip('stopping service sends "SIGTERM" command to forked process')
    it.skip('started service writes to log file')
  })
})
