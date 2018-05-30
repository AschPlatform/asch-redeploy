const Deploy = require('../src/orchestration/deploy')
const assert = require('assert')

describe('', function () {
  it ('works', function () {
    let deploy = new Deploy()
    assert.ok(deploy)
  })
})
