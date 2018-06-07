const inversify = require('inversify')
const helpers = require('inversify-vanillajs-helpers').helpers
require('reflect-metadata')

const SendMoney = require('./orchestration/sendMoney')
const RegisterDapp = require('./orchestration/registerDapp')
const ChangeAschConfig = require('./orchestration/changeAschConfig')
const Deploy = require('./orchestration/deploy')
const StartUpCheck = require('./startup/startUpCheck')
const IsConfigValid = require('./startup/isConfigValid')
const CheckFileStructure = require('./startup/checkFileStructure')
const FILETYPES = {
  SendMoney: 'SendMoney',
  RegisterDapp: 'RegisterDapp',
  ChangeAschConfig: 'ChangeAschConfig',
  Deploy: 'Deploy',
  StartUpCheck: 'StartUpCheck',
  IsConfigValid: 'IsConfigValid',
  CheckFileStructure: 'CheckFileStructure'
}

const Config = require('./startup/loadConfig')()
const Axios = require('axios')
const Logger = require('./logger')
const AschJS = require('asch-js')
const Promise = require('bluebird')
const DappConfig = require('../dapp.json')
const Utils = require('./utils')
const Fs = require('fs')
const Path = require('path')
const CopyDirectory = require('./orchestration/copyDirectory')

const DEPENDENCIES = {
  Config: 'Config',
  Logger: 'Logger',
  Axios: 'Axios',
  AschJS: 'AschJS',
  Promise: 'Promise',
  DappConfig: 'DappConfig',
  Utils: 'Utils',
  Fs: 'Fs',
  Path: 'Path',
  CopyDirectory: 'CopyDirectory'
}

/* register SendMoney */
helpers.annotate(SendMoney, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Promise])

/* register RegisterDapp */
helpers.annotate(RegisterDapp, [DEPENDENCIES.Config, DEPENDENCIES.DappConfig, DEPENDENCIES.Utils, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Logger])

/* register ChangeAschConfig */
helpers.annotate(ChangeAschConfig, [DEPENDENCIES.Config, DEPENDENCIES.Fs, DEPENDENCIES.Path, DEPENDENCIES.Logger])

/* register Deploy */
helpers.annotate(Deploy, [DEPENDENCIES.Config, DEPENDENCIES.CopyDirectory, DEPENDENCIES.Path, DEPENDENCIES.Fs])

/* register StartUpCheck */
helpers.annotate(StartUpCheck, [DEPENDENCIES.Config, FILETYPES.IsConfigValid, FILETYPES.CheckFileStructure])

/* register IsConfigValid */
helpers.annotate(IsConfigValid, [DEPENDENCIES.Config])

/* register CheckFileStructure */
helpers.annotate(CheckFileStructure, [DEPENDENCIES.Config])

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
  registerConstantValue(DEPENDENCIES.Fs, Fs)
  registerConstantValue(DEPENDENCIES.Path, Path)
  registerConstantValue(DEPENDENCIES.CopyDirectory, CopyDirectory)
}

let resetConstants = function () {
  container.unbind(DEPENDENCIES.Config)
  container.unbind(DEPENDENCIES.Logger)
  container.unbind(DEPENDENCIES.Axios)
  container.unbind(DEPENDENCIES.AschJS)
  container.unbind(DEPENDENCIES.Promise)
  container.unbind(DEPENDENCIES.DappConfig)
  container.unbind(DEPENDENCIES.Utils)
  container.unbind(DEPENDENCIES.Fs)
  container.unbind(DEPENDENCIES.Path)
  container.unbind(DEPENDENCIES.CopyDirectory)

  setConstants()
}

// bindings
container.bind(FILETYPES.SendMoney).to(SendMoney)
container.bind(FILETYPES.RegisterDapp).to(RegisterDapp)
container.bind(FILETYPES.ChangeAschConfig).to(ChangeAschConfig)
container.bind(FILETYPES.Deploy).to(Deploy)
container.bind(FILETYPES.StartUpCheck).to(StartUpCheck)
container.bind(FILETYPES.IsConfigValid).to(IsConfigValid)
container.bind(FILETYPES.CheckFileStructure).to(CheckFileStructure)

setConstants()

module.exports = {
  container,
  FILETYPES: FILETYPES,
  DEPENDENCIES: DEPENDENCIES,
  helpers,
  resetConstants
}
