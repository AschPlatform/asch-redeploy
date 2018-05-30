'use strict'

const Deploy = require('../src/orchestration/deploy')
const assert = require('assert')

describe('POST registerDapp', function () {
  it('works', function () {
    let deploy = new Deploy()
    assert.ok(deploy)
  })
})
