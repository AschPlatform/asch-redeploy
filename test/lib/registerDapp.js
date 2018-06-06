'use strict'

const DI = require('../../src/container')
const should = require('should')

describe('registerDapp', function () {
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
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let registerDapp = container.get(DI.FILETYPES.RegisterDapp)
      should(registerDapp).be.ok()
      done()
    })

    it('create random dapp-name and dapp-link', function (done) {
      // config
      let Utils = {
        generateRandomString (length) {
          return 'a'.repeat(length)
        }
      }
      container.unbind(DI.DEPENDENCIES.Utils)
      registerConstant(DI.DEPENDENCIES.Utils, Utils)

      let Axios = {
        post (url, data, headers) {
          return new Promise((resolve, reject) => {
            resolve({
              status: 200,
              data: {
                success: true,
                transactionId: 'someTransactionId'
              }
            })
          })
        }
      }
      container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let DappConfig = {
        'name': 'asdf',
        'link': 'https://asdf.zip',
        'category': 1,
        'description': 'A hello world demo for asch dapp',
        'tags': 'asch,dapp,demo',
        'icon': 'http://o7dyh3w0x.bkt.clouddn.com/hello.png',
        'type': 0,
        'delegates': [
          'db18d5799944030f76b6ce0879b1ca4b0c2c1cee51f53ce9b43f78259950c2fd',
          '590e28d2964b0aa4d7c7b98faee4676d467606c6761f7f41f99c52bb4813b5e4',
          'bfe511158d674c3a1e21111223a49770bee93611d998e88a5d2ea3145de2b68b',
          '7bbf62931cf3c596591a580212631aff51d6bc0577c54769953caadb23f6ab00',
          '452df9213aedb3b9fed6db3e2ea9f49d3db226e2dac01828bc3dcd73b7a953b4'
        ],
        'unlockDelegates': 3
      }
      container.unbind(DI.DEPENDENCIES.DappConfig)
      registerConstant(DI.DEPENDENCIES.DappConfig, DappConfig)

      let AschJS = {
        called: 0,
        dapp: {
          createDApp (dapp, secret, secondSecret) {
            AschJS.called++
            AschJS.dapp_name = dapp.name
            AschJS.dapp_link = dapp.link
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.AschJS)
      registerConstant(DI.DEPENDENCIES.AschJS, AschJS)

      // act
      let register = container.get(DI.FILETYPES.RegisterDapp)
      register.register()
        .then((result) => {
          should(AschJS.called).equal(1)
          should(AschJS).have.property('dapp_name')
          should(AschJS).have.property('dapp_link')
          should(AschJS.dapp_name).endWith('aaaaaaaaaaaaaaa')
          should(AschJS.dapp_link).endWith('aaaaaaaaaaaaaaa.zip')
          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it('call to endpoint returns correct transactionId', function (done) {
      let transactionId = 'd73140080db8fdc838779d0c7ef9e7b3068186b882385acd0bbafc3f0aea29fb'
      // config
      let AschJS = {
        dapp: {
          createDApp (dapp, secret, secondSecret) {
            return {
              id: transactionId
            }
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.AschJS)
      registerConstant(DI.DEPENDENCIES.AschJS, AschJS)

      let Axios = {
        post (url, data, headers) {
          return new Promise((resolve, reject) => {
            resolve({
              status: 200,
              data: {
                success: true,
                transactionId: transactionId
              }
            })
          })
        }
      }
      container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let register = container.get(DI.FILETYPES.RegisterDapp)
      register.register()
        .then((result) => {
          should(result).equals(transactionId)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
  })
})
