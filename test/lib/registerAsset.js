'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('registerAsset', function () {
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

    const Config = {
      dapp: {
        masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix',
        masterAccountPassword2nd: ''
      },
      node: {
        host: 'http://localhost',
        port: '4096'
      },
      uia: {
        publisher: 'CCTime',
        asset: 'XCT'
      }
    }
    DI.container.unbind(DI.DEPENDENCIES.Config)
    registerConstant(DI.DEPENDENCIES.Config, Config)
  })

  afterEach('cleanup', function () {
    DI.resetConstants()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let registerAsset = DI.container.get(DI.FILETYPES.RegisterAsset)

      should(registerAsset).be.ok()
      should(registerAsset).have.property('config')
      should(registerAsset).have.property('aschJS')
      should(registerAsset).have.property('axios')
      should(registerAsset).have.property('logger')
      should(registerAsset).have.property('promise')
      done()
    })

    it('Asset does not exists - asset will be registered', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnVal = {
              status: 200,
              data: {
                success: false,
                error: 'Asset not found'
              }
            }
            resolve(returnVal)
          })
        },
        postCalled: 0,
        post () {
          Axios.postCalled++
          return new Promise((resolve, reject) => {
            let returnVal = {
              status: 200,
              data: {
                success: true,
                transactionId: '3nief0HUfhueghfeuehrb341g23g16fgh'
              }
            }
            resolve(returnVal)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let registerAsset = container.get(DI.FILETYPES.RegisterAsset)
      registerAsset.waitingMS = 10
      registerAsset.start()
        .then((result) => {
          should(result).equals(true)

          should(Axios.getCalled).equals(1)
          should(Axios.postCalled).equals(1)

          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it('Asset is already registered - return true', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: true,
                asset: {
                  name: 'CCtime.XCT',
                  desc: 'xct',
                  maximum: '10000000000000',
                  precision: 8,
                  strategy: '',
                  quantity: '0'
                }
              }
            }

            resolve(returnData)
          })
        },
        postCalled: 0,
        post () {
          Axios.postCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: true,
                transactionId: 'et9gh393jfh'
              }
            }
            resolve(returnData)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let registerAsset = container.get(DI.FILETYPES.RegisterAsset)
      registerAsset.waitingMS = 10
      registerAsset.start()
        .then((result) => {
          should(result).equals(true)

          should(Axios.getCalled).equals(1)
          should(Axios.postCalled).equals(0)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })
})
