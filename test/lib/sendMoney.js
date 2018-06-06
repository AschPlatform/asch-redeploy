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

  it.skip('zero balance on dapp-master-account cause a money transfer and returns transactionId', function () {
  })

  it.skip('enough filled dapp-master-account returns "enough_money" message', function () {
  })

  it.skip('network error exists with')
})
