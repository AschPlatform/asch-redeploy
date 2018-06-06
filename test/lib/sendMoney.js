'use strict'

const DI = require('../../src/container')
// const SendMoney = require('../../src/orchestration/sendMoney')
const should = require('should')

describe('sendMoney', function () {
  let container = DI.container

  before('setup', function () {
    const registerConstantValue = DI.helpers.registerConstantValue(container)

    // axios
    const Axios = {
      post (url, config) {
        return new Promise((resolve, reject) => {
          console.log('I am in axios post')
          resolve(true)
        })
      }
    }

    DI.container.unbind(DI.DEPENDENCIES.Axios)
    registerConstantValue(DI.DEPENDENCIES.Axios, Axios)

    // logger
    const Logger = {
      info (text, config) {
        console.log(text)
      },
      verbose (text, config) {
        console.log(text)
      }
    }

    DI.container.unbind(DI.DEPENDENCIES.Logger)
    registerConstantValue(DI.DEPENDENCIES.Logger, Logger)
  })

  after('cleanup', function () {

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

  it.skip('zero balance on genesis-account exits with error', function () {
  })

  it.skip('zero balance on dapp-master-account cause a money transfer and returns transactionId', function () {
  })

  it.skip('enough filled dapp-master-account returns "enough_money" message', function () {
  })

  it.skip('network error exists with')
})
