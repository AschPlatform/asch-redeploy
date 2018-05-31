const axios = require('axios')
const bluebird = require('bluebird')
const aschJS = require('asch-js')
const fs = require('fs')
const path = require('fs')

const utils = require('./utils')
const logger = require('./logger')

let container = {
  axios: axios,
  Promise: bluebird,
  aschJS: aschJS,
  fs: fs,
  path: path,

  utils: utils,
  logger: logger
}

global.container = container
