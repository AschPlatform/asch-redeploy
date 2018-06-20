'use strict'

const DI = require('../../src/DI')
const should = require('should')

describe('refuelDapp', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  beforeEach('setup', function () {
    // logger
    const Logger = {
      info (text, config) {
      },
      warn (text, config) {
      }
    }

    DI.container.unbind(DI.DEPENDENCIES.Logger)
    registerConstant(DI.DEPENDENCIES.Logger, Logger)
  })

  describe('happy path', function (done) {
    it('DI worked', function (done) {
      let refuelDapp = container.get(DI.FILETYPES.RefuelDapp)

      should(refuelDapp).be.ok()
      should(refuelDapp).have.property('config')
      should(refuelDapp).have.property('axios')
      should(refuelDapp).have.property('aschJS')
      should(refuelDapp).have.property('logger')
      done()
    })
  })
})
