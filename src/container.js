const inversify = require('inversify')
const helpers = require('inversify-vanillajs-helpers').helpers
require('reflect-metadata')

const SendMoney = require('./orchestration/sendMoney')
const RegisterDapp = require('./orchestration/registerDapp')
const FILETYPES = {
  SendMoney: 'SendMoney',
  RegisterDapp: 'RegisterDapp'
}

const Config = require('config').config
const Axios = require('axios')
const Logger = require('./logger')
const AschJS = require('asch-js')
const Promise = require('bluebird')
const DappConfig = require('../dapp.json')
const Utils = require('./utils')

const DEPENDENCIES = {
  Config: 'Config',
  Logger: 'Logger',
  Axios: 'Axios',
  AschJS: 'AschJS',
  Promise: 'Promise',
  DappConfig: 'DappConfig',
  Utils: 'Utils'
}

/* register SendMoney */
helpers.annotate(SendMoney, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Promise])

/* register RegisterDapp */
helpers.annotate(RegisterDapp, [DEPENDENCIES.Config, DEPENDENCIES.DappConfig, DEPENDENCIES.Utils, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Logger])

var container = new inversify.Container()

let setConstants = function () {
  const registerConstantValue = helpers.registerConstantValue(container)
  registerConstantValue(DEPENDENCIES.Config, Config)
  registerConstantValue(DEPENDENCIES.Logger, Logger)
  registerConstantValue(DEPENDENCIES.Axios, Axios)
  registerConstantValue(DEPENDENCIES.AschJS, AschJS)
  registerConstantValue(DEPENDENCIES.Promise, Promise)
  registerConstantValue(DEPENDENCIES.DappConfig, DappConfig)
  registerConstantValue(DEPENDENCIES.Utils, Utils)
}

let resetConstants = function () {
  container.unbind(DEPENDENCIES.Config)
  container.unbind(DEPENDENCIES.Logger)
  container.unbind(DEPENDENCIES.Axios)
  container.unbind(DEPENDENCIES.AschJS)
  container.unbind(DEPENDENCIES.Promise)
  container.unbind(DEPENDENCIES.DappConfig)
  container.unbind(DEPENDENCIES.Utils)

  setConstants()
}

// bindings
container.bind(FILETYPES.SendMoney).to(SendMoney)
container.bind(FILETYPES.RegisterDapp).to(RegisterDapp)

setConstants()

module.exports = {
  container,
  FILETYPES: FILETYPES,
  DEPENDENCIES: DEPENDENCIES,
  helpers,
  resetConstants
}
