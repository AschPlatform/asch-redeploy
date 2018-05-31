'use strict'

const SendMoney = require('../../src/orchestration/sendMoney')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const should = require('should')

describe('sendMoney@getBalance', function () {
  let config = {
    dapp: {
      masterAccountPassword: 'sentence weasel match weather apple onion release keen lens deal fruit matrix',
      masterAccountPassword2nd: ''
    },
    node: {
      host: 'http://localhost',
      port: '4096',
      magic: 'something'
    }
  }

  var instance
  var mock
  let response = { success: true, balance: 2000 * 1e8 }

  // after(function () {
  //   mock.restore()
  // })

  beforeEach(function () {
    instance = axios.create()
    mock = new MockAdapter(instance)

    // mock.onGet('http://localhost:4096/api/accounts/getBalance')
    //   .reply(200, response)
  })

  let parameters = {
    params: {
      address: 'AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB'
    }
  }

  it('setup is Ok', function (done) {
    let sendMoney = new SendMoney(config)
    should(sendMoney).be.ok()
    done()
  })

  it('hit endpoint', function (done) {
    mock.onGet('http://localhost:4096/api/accounts/getBalance', parameters)
      .reply(200, response)

    instance.get('http://localhost:4096/api/accounts/getBalance',
      {
        params: {
          address: 'AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB'
        }
      }
    )
      .then(function (res) {
        console.log(`result: ${res}`)
      })
      .then(done)
      .catch(function (err) {
        console.log(`error: ${err}`)
      })
  })
})
