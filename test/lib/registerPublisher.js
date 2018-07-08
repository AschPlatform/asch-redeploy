'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('registerPublisher', function () {
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
      let registerPublisher = DI.container.get(DI.FILETYPES.RegisterPublisher)

      should(registerPublisher).be.ok()
      should(registerPublisher).have.property('config')
      should(registerPublisher).have.property('aschJS')
      should(registerPublisher).have.property('axios')
      should(registerPublisher).have.property('logger')
      should(registerPublisher).have.property('promise')
      done()
    })

    it('No publisher exists - publisher will be registered', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let result = {
              status: 200,
              data: {
                success: false,
                error: 'Issuer not found'
              }
            }

            resolve(result)
          })
        },
        postCalled: 0,
        post () {
          Axios.postCalled++
          return new Promise((resolve, reject) => {
            let data = {
              status: 200,
              data: {
                success: true,
                transactionId: 'egh893hf3012nklyiNHpgneboNEN'
              }
            }
            resolve(data)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let registerPublisher = container.get(DI.FILETYPES.RegisterPublisher)
      registerPublisher.waitingMS = 100
      registerPublisher.start()
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

    it('Same publisher was already registered - return true', function (done) {
      const Axios = {
        getCalled: 0,
        get () {
          Axios.getCalled++
          return new Promise((resolve, reject) => {
            let result = {
              status: 200,
              data: {
                success: true,
                issuer: {
                  name: 'CCTime',
                  desc: 'CCTime'
                }
              }
            }

            resolve(result)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let registerPublisher = container.get(DI.FILETYPES.RegisterPublisher)
      registerPublisher.start()
        .then((result) => {
          should(result).equals(true)
          should(Axios.getCalled).equals(1)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('Other publisher was registered - throws error', function (done) {
      const Axios = {
        called: 0,
        get () {
          Axios.called++
          return new Promise((resolve, reject) => {
            let result = {
              status: 200,
              data: {
                success: true,
                issuer: {
                  name: 'KCM',
                  desc: 'KCM'
                }
              }
            }

            resolve(result)
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let registerPublisher = container.get(DI.FILETYPES.RegisterPublisher)
      registerPublisher.start()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('other_publisher_registered')
          should(Axios.called).equals(1)
          done()
        })
    })
  })
})
