'use strict'

const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')

describe('writeOutput', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  beforeEach('setup', function () {
    // logger
    const Logger = {
      info (text, config) {
      },
      warn (text, config) {
      }
    }

    DI.container.unbind(DI.DEPENDENCIES.Logger)
    registerConstant(DI.DEPENDENCIES.Logger, Logger)
  })

  afterEach('cleanup', function () {
    mockFs.restore()
  })

  describe('happy path', function (done) {
    it('DI worked', function (done) {
      let changeAschConfig = container.get(DI.FILETYPES.ChangeAschConfig)

      should(changeAschConfig).be.ok()
      should(changeAschConfig).have.property('config')
      should(changeAschConfig).have.property('fs')
      should(changeAschConfig).have.property('path')
      should(changeAschConfig).have.property('logger')
    })

    it('add new dappId to asch/config.json file', function (done) {
      // config
      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        dapp: {
          masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix'
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let dappId = 'a8h04i3tnyonmfepnyiefj'
      let fileBefore = {
        'dapp': {
          'masterpassword': 'ytfACAMegjrK',
          'params': {
          }
        }
      }
      let fileAfter = {
        'dapp': {
          'masterpassword': 'ytfACAMegjrK',
          'params': {
            'a8h04i3tnyonmfepnyiefj': [
              'sentence weasel match weather apple onion release keen lens deal fruit matrix'
            ]
          }
        }
      }

      mockFs({
        '/home/user/asch': {
          'config.json': JSON.stringify(fileBefore)
        }
      })

      let writeOutput = container.get(DI.FILETYPES.ChangeAschConfig)
      writeOutput.add(dappId)
        .then((result) => {
          let fs = container.get(DI.DEPENDENCIES.Fs)
          let configFile = fs.readFileSync('/home/user/asch/config.json', 'utf8')
          configFile = JSON.parse(configFile)

          should(fileAfter).deepEqual(configFile)
          should(result).equals(true)

          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('file config.json doesn\'t exists', function (done) {
      // config
      let dappId = 'jg8h2051iiIFHEGH35'
      let Config = {
        node: {
          directory: '/home/user/asch'
        },
        dapp: {
          masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix'
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      mockFs({
        '/home/user/aschWrongDir': {
        }
      })

      let changeAschConfig = container.get(DI.FILETYPES.ChangeAschConfig)
      changeAschConfig.add(dappId)
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('asch_config_file_not_found')
          done()
        })
    })

    it('calling writeOutput.add() without dappId throws exception', function (done) {
      let dappId = null

      let writeOutput = container.get(DI.FILETYPES.ChangeAschConfig)
      writeOutput.add(dappId)
        .then((result) => {
          throw new Error()
        })
        .catch(() => {
          done()
        })
    })
  })
})
