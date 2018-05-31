'use strict'

const Deploy = require('../src/orchestration/deploy')
const axios = require('axios')
const MockAdapter = require('axios-mock-adapter')
const should = require('should')

describe('Dapp registration', function () {
  it('setup of deploy.js', function (done) {
    // setup
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
    // act
    let deploy = new Deploy(config)
    // assert
    should(deploy).be.ok()
    done()
  })

  it('call registerDapp function', function (done) {
    // setup
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
    let deploy = new Deploy(config)

    // prepare mock
    let response = { success: true, transactionId: 'fiaigh' }
    let mock = new MockAdapter(axios)
    mock.onPost('http://localhost:4096/peer/transactions')
      .reply(200, response)

    deploy.registerDapp()
      .then(function (res) {
        console.log(res.data)
      })
      .then(function () {
        done()
      }, done)
  })
})
