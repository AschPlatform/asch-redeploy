const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')
const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const moment = require('moment')

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
      should(service).have.property('fork')

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

      let Moment = function () {
        return moment.utc('2017-01-01T01:00:00')
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      let expectedLogFile = path.join('/home/user/dapp', 'logs', 'asch-node-2017-01-01.log')

      let Fork = (path, args, option) => {
        let appjsContent = fs.readFileSync('/home/user/asch/app.js', 'utf8')
        fs.writeFileSync(expectedLogFile, appjsContent, 'utf8')
        return new EventEmitter()
      }
      container.unbind(DI.DEPENDENCIES.Fork)
      registerConstant(DI.DEPENDENCIES.Fork, Fork)

      // overwrite
      let service = container.get(DI.FILETYPES.Service)
      service.start()
        .then((result) => {
          let expectedLogFile = path.join('/home/user/dapp', 'logs', 'asch-node-2017-01-01.log')

          should(fs.existsSync(expectedLogFile)).equals(true)
          should(fs.readFileSync(expectedLogFile, 'utf8')).equals('write_to_appjs')

          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it.skip('stopping service emits exit event and corresponding exit code', function (done) {
    })

    it.skip('stopping service sends "SIGTERM" command to forked process')
    it.skip('started service writes to log file')
  })
})
