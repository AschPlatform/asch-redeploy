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

    it('calling api returns correct transactionId', function (done) {
      let transactionId = '79350edd61339c8174195221c8ba92c864124b4a212c5d102c896ede6a1170cb'

      let AschJS = {
        transfer: {
          createInTransfer: (dappId, currency, amount, masterPsw, masterPsw2nd) => {
            return {
              id: 'myTransactions'
            }
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.AschJS)
      registerConstant(DI.DEPENDENCIES.AschJS, AschJS)

      let Axios = {
        post (url, data, headers) {
          return new Promise((resolve, reject) => {
            resolve({
              status: 200,
              data: {
                success: true,
                transactionId: transactionId
              }
            })
          })
        }
      }
      container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let dappId = 'i35fgjyxE5orjt51JIfyJFE15ybeJij3'

      let refuelDapp = container.get(DI.FILETYPES.RefuelDapp)
      refuelDapp.refuel(dappId)
        .then((result) => {
          should(result).deepEqual(transactionId)
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('calling refuel() without dappId throws exception', function (done) {
      let dappId = null

      let refuelDapp = container.get(DI.FILETYPES.RefuelDapp)
      refuelDapp.refuel(dappId)
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('dappId must be')
          done()
        })
    })

    it('on network error return exception', function (done) {
      let message = 'connect ECONNREFUSED 127.0.0.1:4096'
      const Axios = {
        called: 0,
        post (url, config) {
          this.called++
          // throw on first request
          return new Promise((resolve, reject) => {
            reject(new Error(message))
          })
        }
      }
      DI.container.unbind(DI.DEPENDENCIES.Axios)
      registerConstant(DI.DEPENDENCIES.Axios, Axios)

      let dappId = 'ahg90159hoi24uyhIhrtiRJNOPGe35'

      let refuelDapp = container.get(DI.FILETYPES.RefuelDapp)
      refuelDapp.refuel(dappId)
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('connect ECONNREFUSED')
          done()
        })
    })
  })
})
