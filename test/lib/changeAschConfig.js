'use strict'

const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')

describe('writeOutput', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)
  afterEach('cleanup', function () {
    mockFs.restore()
  })

  describe('happy path', function (done) {
    it('add new dappId to config.json file', function (done) {
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
          should(result).equals(true)
          let fs = container.get(DI.DEPENDENCIES.Fs)
          let configFile = fs.readFileSync('/home/user/asch/config.json', 'utf8')
          console.log(`configfile: ${configFile}`)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it.skip('file config.json doesn\'t exists', function (done) {
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
