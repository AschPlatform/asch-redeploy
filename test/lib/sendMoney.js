'use strict'

const DI = require('../../src/container')
// const SendMoney = require('../../src/orchestration/sendMoney')
const should = require('should')

describe('sendMoney', function () {
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
    it('injection worked', function (done) {
      let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)

      should(sendMoney).be.ok()
      should(sendMoney).have.property('config')
      should(sendMoney).have.property('logger')
      should(sendMoney).have.property('axios')
      should(sendMoney).have.property('aschJS')
      should(sendMoney).have.property('Promise')
      done()
    })

    it('zero balance on dapp-master-account starts money-transfer and returns transactionId', function (done) {
      // config
      let transactionId = 'i300gho34h0hgyxghzzwzdbyzHB34'
      const Axios = {
        called: 0,
        post (url, config) {
          return new Promise((resolve, reject) => {
            this.called += 1

            let result = {}
            if (this.called === 1) {
              result = {
                status: 200,
                data: {
                  success: true,
                  account: {
                    balance: 100000 * 1e8,
                    address: '14762548536863074694'
                  }
                }
              }
            }
            if (this.called === 2) {
              result = {
                status: 200,
                data: {
                  success: true,
                  account: {
                    balance: 0,
                    address: 'AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB'
                  }
                }
              }
            }
            if (this.called === 3) {
              result = {
                status: 200,
                data: {
                  success: true,
                  transactionId: transactionId
                }
              }
            }

            resolve(result)
          })
        }
      }

      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      /* act */
      let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)
      sendMoney.sendMoney()
        .then((result) => {
          should(result).equals(transactionId)
          done()
        })
        .catch((error) => {
          throw error
        })
    })

    it('already charged dapp-master-account returns "enough_money" message', function (done) {
      // config
      const Axios = {
        called: 0,
        post (url, config) {
          return new Promise((resolve, reject) => {
            this.called += 1

            let result = {}
            if (this.called === 1) {
              result = {
                status: 200,
                data: {
                  success: true,
                  account: {
                    balance: 100000 * 1e8,
                    address: '14762548536863074694'
                  }
                }
              }
            }
            if (this.called === 2) {
              result = {
                status: 200,
                data: {
                  success: true,
                  account: {
                    balance: 50000 * 1e8,
                    address: 'AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB'
                  }
                }
              }
            }

            resolve(result)
          })
        }
      }

      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      /* act */
      let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)
      sendMoney.sendMoney()
        .then((result) => {
          throw new Error(result)
        })
        .catch((error) => {
          should(error.message).equals('enough_money')
          done()
        })
    })
  })

  describe('sad path', function () {
    it('zero balance on genesis-account exits with error', function (done) {
      // config
      const Axios = {
        post (url, config) {
          return new Promise((resolve, reject) => {
            let result = {
              status: 200,
              data: {
                success: true,
                account: {
                  balance: 0,
                  address: '14762548536863074694'
                }
              }
            }

            resolve(result)
          })
        }
      }

      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      /* act */
      let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)
      sendMoney.sendMoney()
        .then((result) => {
          console.log(`result: ${result}`)
        })
        .then(() => {
          throw new Error('should throw exception')
        })
        .catch((error) => {
          should(error).has.property('message').startWith('genesisAccount_empty')
          done()
        })
    })

    it('network error exists with exception', function (done) {
      // config
      let message = 'connect ECONNREFUSED 127.0.0.1:4096'

      const Axios = {
        called: 0,
        post (url, config) {
          this.called++
          // throw on first request
          return new Promise((resolve, reject) => {
            reject(new Error(message))
          })
        }
      }

      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let sendMoney = container.get(DI.FILETYPES.SendMoney)
      sendMoney.sendMoney()
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('connect ECONNREFUSED')
          done()
        })
    })
  })
})
