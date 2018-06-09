'use strict'

const DI = require('../../src/container')
const should = require('should')
const mockFs = require('mock-fs')
const fs = require('fs')

describe('serializedNewDappId', function () {
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
      let serializedNewDappId = DI.container.get(DI.FILETYPES.SerializedNewDappId)

      should(serializedNewDappId).be.ok()
      should(serializedNewDappId).have.property('config')
      done()
    })

    it('serializes new dappId to file', function (done) {
      mockFs({
        '/home/user/dapp/development': {
        }
      })

      let Config = {
        node: {
          host: 'http://localhost',
          port: '4096'
        },
        output: {
          file: '/home/user/dapp/development/dappConfig.json'
        }
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let dappId = '3uthTRGrJ6I6HSDjzkd3er7it246dfrthtjts'

      let serializedNewDappId = DI.container.get(DI.FILETYPES.SerializedNewDappId)
      let result = serializedNewDappId.serializeSync(dappId)

      should(result).equals(true)
      let fileContent = fs.readFileSync('/home/user/dapp/development/dappConfig.json', 'utf8')
      let parsedContent = JSON.parse(fileContent)
      should(parsedContent).have.property('dappId')
      should(parsedContent.dappId).equal(dappId)
      done()
    })
  })

  describe('sad path', function () {
    it('write to no file if output property is not configured', function (done) {
      mockFs({
        '/home/user/dapp/development': {
        }
      })

      let Config = {
        node: {
          host: 'http://localhost',
          port: '4096'
        },
        output: {
        }
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let dappId = '6urt4TTUUGSJTJDhrtgyxef4'

      let serializedNewDappId = DI.container.get(DI.FILETYPES.SerializedNewDappId)
      let result = serializedNewDappId.serializeSync(dappId)

      should(result).equals(false)
      let dirContent = fs.readdirSync('/home/user/dapp/development')
      should(dirContent).deepEqual([])
      done()
    })
  })
})
