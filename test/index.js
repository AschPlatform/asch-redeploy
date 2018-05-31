'use strict'

const Deploy = require('../src/orchestration/deploy')
const assert = require('assert')

describe('POST registerDapp', function () {
  it('works', function () {
    let config = {
      node: {
        host: 'http://localhost',
        port: '4096',
        magic: 'something'
      }
    }

    let deploy = new Deploy(config)
    let result = deploy.registerDapp()
    assert.ok(deploy)
    assert.ok(result)
  })
})
