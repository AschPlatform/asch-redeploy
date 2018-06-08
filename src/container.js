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
const Service = require('./orchestration/service')
const CreateLogDir = require('./orchestration/createLogDir')
const FILETYPES = {
  SendMoney: 'SendMoney',
  RegisterDapp: 'RegisterDapp',
  ChangeAschConfig: 'ChangeAschConfig',
  Deploy: 'Deploy',
  StartUpCheck: 'StartUpCheck',
  IsConfigValid: 'IsConfigValid',
  CheckFileStructure: 'CheckFileStructure',
  Service: 'Service',
  CreateLogDir: 'CreateLogDir'
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
const CheckArch = new (require('./startup/checkArch'))()
const ZSchema = require('z-schema')
const CustomValidators = require('./startup/customValidators')
const ConfigSchema = require('./startup/configSchema')
const EventEmitter = require('events')
const Moment = require('moment')

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
  CopyDirectory: 'CopyDirectory',
  CheckArch: 'CheckArch',
  ZSchema: 'ZSchema',
  CustomValidators: 'CustomValidators',
  ConfigSchema: 'ConfigSchema',
  EventEmitter: 'EventEmitter',
  Moment: 'Moment'
}

var container = new inversify.Container()

// annotate
helpers.annotate(SendMoney, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Promise])
helpers.annotate(RegisterDapp, [DEPENDENCIES.Config, DEPENDENCIES.DappConfig, DEPENDENCIES.Utils, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Logger])
helpers.annotate(ChangeAschConfig, [DEPENDENCIES.Config, DEPENDENCIES.Fs, DEPENDENCIES.Path, DEPENDENCIES.Logger])
helpers.annotate(Deploy, [DEPENDENCIES.Config, DEPENDENCIES.CopyDirectory, DEPENDENCIES.Path, DEPENDENCIES.Fs])
helpers.annotate(StartUpCheck, [DEPENDENCIES.Config, FILETYPES.IsConfigValid, FILETYPES.CheckFileStructure, DEPENDENCIES.CheckArch])
helpers.annotate(IsConfigValid, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.ZSchema, DEPENDENCIES.CustomValidators, DEPENDENCIES.ConfigSchema])
helpers.annotate(CheckFileStructure, [DEPENDENCIES.Config])
helpers.annotate(Service, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Moment, DEPENDENCIES.Path, DEPENDENCIES.Fs, DEPENDENCIES.EventEmitter, FILETYPES.CreateLogDir])
helpers.annotate(CreateLogDir, [DEPENDENCIES.Config, DEPENDENCIES.Fs, DEPENDENCIES.Path])

let setup = function () {
  // bindings
  container.bind(FILETYPES.SendMoney).to(SendMoney)
  container.bind(FILETYPES.RegisterDapp).to(RegisterDapp)
  container.bind(FILETYPES.ChangeAschConfig).to(ChangeAschConfig)
  container.bind(FILETYPES.Deploy).to(Deploy)
  container.bind(FILETYPES.StartUpCheck).to(StartUpCheck)
  container.bind(FILETYPES.IsConfigValid).to(IsConfigValid)
  container.bind(FILETYPES.CheckFileStructure).to(CheckFileStructure)
  container.bind(FILETYPES.Service).to(Service)
  container.bind(FILETYPES.CreateLogDir).to(CreateLogDir)

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
  registerConstantValue(DEPENDENCIES.CheckArch, CheckArch)
  registerConstantValue(DEPENDENCIES.ZSchema, ZSchema)
  registerConstantValue(DEPENDENCIES.CustomValidators, CustomValidators)
  registerConstantValue(DEPENDENCIES.ConfigSchema, ConfigSchema)
  registerConstantValue(DEPENDENCIES.EventEmitter, EventEmitter)
  registerConstantValue(DEPENDENCIES.Moment, Moment)
}

let resetConstants = function () {
  container.unbindAll()
  setup()
}

setup()

module.exports = {
  container,
  FILETYPES: FILETYPES,
  DEPENDENCIES: DEPENDENCIES,
  helpers,
  resetConstants
}
