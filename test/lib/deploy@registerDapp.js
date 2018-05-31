'use strict'

const Deploy = require('../../src/orchestration/deploy')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const should = require('should')
const sinon = require('sinon/pkg/sinon')
const aschJS = require('asch-js')

describe('deploy@registerDapp', function () {
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

  let axiosMock = new MockAdapter(axios)
  let axiosResponse = { success: true, transactionId: 'veryLongTransactionId' }

  before(function () {
    axiosMock.onPost('http://localhost:4096/peer/transactions')
      .reply(200, axiosResponse)
  })

  after(function () {
    axiosMock.restore()
  })

  it('setup of deploy.js', function (done) {
    // act
    let deploy = new Deploy(config)
    // assert
    should(deploy).be.ok()
    done()
  })

  it('calls localnet endpoint for dapp registration', function (done) {
    let deploy = new Deploy(config)

    deploy.registerDapp()
      .then(function (res) {
      })
      .then(function () {
        done()
      }, done)
  })

  it('aschJS gets called from dapp-registration', function (done) {
    let deploy = new Deploy(config)

    let mock = sinon.mock(aschJS.dapp)
    mock.expects('createDApp').once()

    deploy.registerDapp()
      .then(function (res) {
        done()
      })
      .catch(function (err) {
        console.log(err)
        mock.verify()
        done()
      })
  })
})
