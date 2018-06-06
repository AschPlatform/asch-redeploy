const inversify = require('inversify')
const helpers = require('inversify-vanillajs-helpers').helpers
require('reflect-metadata')

const SendMoney = require('./orchestration/sendMoney')
const FILETYPES = {
  SendMoney: 'SendMoney'
}

const Config = require('config').config
const Axios = require('axios')
const Logger = require('./logger')
const AschJS = require('asch-js')
const Promise = require('bluebird')

const DEPENDENCIES = {
  Config: 'Config',
  Logger: 'Logger',
  Axios: 'Axios',
  AschJS: 'AschJS',
  Promise: 'Promise'
}

helpers.annotate(SendMoney, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Promise])

var container = new inversify.Container()

// bindings
container.bind(FILETYPES.SendMoney).to(SendMoney)

const registerConstantValue = helpers.registerConstantValue(container)
registerConstantValue(DEPENDENCIES.Config, Config)

registerConstantValue(DEPENDENCIES.Logger, Logger)
registerConstantValue(DEPENDENCIES.Axios, Axios)
registerConstantValue(DEPENDENCIES.AschJS, AschJS)
registerConstantValue(DEPENDENCIES.Promise, Promise)

module.exports = {
  container,
  FILETYPES: FILETYPES,
  DEPENDENCIES: DEPENDENCIES,
  helpers
}
