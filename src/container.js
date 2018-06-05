const realAxios = require('axios')
const realBlueBird = require('bluebird')
const realAschJS = require('asch-js')
const realFS = require('fs')
const realPath = require('fs')

const realUtils = require('./utils')
const realLogger = require('./logger')

let container = {
  axios: realAxios,
  Promise: realBlueBird,
  aschJS: realAschJS,
  fs: realFS,
  path: realPath,

  utils: realUtils,
  logger: realLogger,

  reset: () => {
    this.axios = realAxios
    this.Promise = realBlueBird
    this.aschJS = realAschJS
    this.fs = realFS
    this.path = realPath

    this.utils = realUtils
    this.logger = realLogger
  }
}

global.container = container
