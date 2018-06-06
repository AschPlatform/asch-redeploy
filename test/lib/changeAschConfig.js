'use strict'

const DI = require('../../src/container')
const should = require('should')

describe('writeOutput', function () {
  let container = DI.container

  describe('happy path', function () {
    it('add new dappId to config.json file', function (done) {
      let dappId = 'a8h04i3tnyonmfepnyiefj'

      let writeOutput = container.get(DI.FILETYPES.WriteOutput)
      writeOutput.add(dappId)
        .then((result) => {
          should(result).equals(true)
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it.skip('file config.json doesn\'t exists')
  })
})
