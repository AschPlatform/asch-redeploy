'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('createTokens', function () {
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
      let createTokens = DI.container.get(DI.FILETYPES.CreateTokens)

      should(createTokens).be.ok()
      should(createTokens).have.property('config')
      should(createTokens).have.property('aschJS')
      should(createTokens).have.property('axios')
      should(createTokens).have.property('logger')
      should(createTokens).have.property('promise')
      done()
    })

    it('0 balance creates new tokens', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: false,
                error: 'Balance info not found'
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
                transactionId: '39jiehefiNefiNetnbknrer03i523'
              }
            }

            resolve(returnData)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let createTokens = container.get(DI.FILETYPES.CreateTokens)
      createTokens.waitingMS = 10
      createTokens.start()
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

    it('existing balance of 11000 token does not create new tokens', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: true,
                balance: {
                  currency: 'CCTime.XCT',
                  balance: '1100000000000',
                  maximum: '1000000000000000000',
                  precision: 8,
                  quantity: '2000000000000',
                  writeoff: 0,
                  allowWriteoff: 0,
                  allowWhitelist: 0,
                  allowBlacklist: 0,
                  maximumShow: '10000000000',
                  quantityShow: '20000',
                  balanceShow: '11000'
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
                transactionId: 'ff3ryg4gthth23535GGYR'
              }
            }

            resolve(returnData)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let createTokens = container.get(DI.FILETYPES.CreateTokens)
      createTokens.waitingMS = 10
      createTokens.start()
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

    it('existing balance of 9000 tokens creates new 20000 tokens', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: true,
                balance: {
                  currency: 'CCTime.XCT',
                  balance: '900000000000',
                  maximum: '1000000000000000000',
                  precision: 8,
                  quantity: '2000000000000',
                  writeoff: 0,
                  allowWriteoff: 0,
                  allowWhitelist: 0,
                  allowBlacklist: 0,
                  maximumShow: '10000000000',
                  quantityShow: '20000',
                  balanceShow: '9000'
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
                transactionId: 'jiejifjeFIF2353HFUenfyiH2RI'
              }
            }

            resolve(returnData)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let createTokens = container.get(DI.FILETYPES.CreateTokens)
      createTokens.waitingMS = 10
      createTokens.start()
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
  })

  describe('sad path', function () {
    it('Exceeding issue limit throws error', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: true,
                balance: {
                  currency: 'CCTime.XCT',
                  balance: '900000000000',
                  maximum: '2000000000000',
                  precision: 8,
                  quantity: '2000000000000',
                  writeoff: 0,
                  allowWriteoff: 0,
                  allowWhitelist: 0,
                  allowBlacklist: 0,
                  maximumShow: '20000',
                  quantityShow: '20000',
                  balanceShow: '9000'
                }
              }
            }

            resolve(returnData)
          })
        },
        postCalled: 0,
        post () {
          return new Promise((resolve, reject) => {
            let returnData = {
              status: 200,
              data: {
                success: false,
                error: 'Exceed issue limit'
              }
            }
            resolve(returnData)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let createTokens = container.get(DI.FILETYPES.CreateTokens)
      createTokens.waitingMS = 10
      createTokens.start()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('exceeded_issue_limit')

          done()
        })
    })
  })
})
