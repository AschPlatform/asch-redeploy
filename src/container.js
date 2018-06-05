/* eslint-disable */

const inversify = require('inversify')
const helpers = require('inversify-vanillajs-helpers').helpers
require('reflect-metadata')

const SendMoney = require('./orchestration/sendMoney')


const FILETYPES = {
  SendMoney: 'SendMoney'
}

const DEPENDENCIES = {
  Config: 'Config',
  Logger: 'Logger',
  Axios: 'Axios',
  AschJS: 'AschJS',
  Promise: 'Promise'
}


// register config
let Config = require('config').config
console.log(`config: ${JSON.stringify(Config)}`)


var container = new inversify.Container()


var registerConstantValue = helpers.registerConstantValue(container);
registerConstantValue(DEPENDENCIES.Config, Config)



// TODO Annotate the dependencies

// config, logger, axios, aschJS, promise
// helpers.annotate(SendMoney, [DEPENDENCIES.Config, DEPENDENCIES.Logger, DEPENDENCIES.Axios, DEPENDENCIES.AschJS, DEPENDENCIES.Promise])

let resolvedConfig = container.get(DEPENDENCIES.Config)
console.log(`\nresolvedConfig: ${JSON.stringify(resolvedConfig)}`)


process.exit(0)



var TYPES = {
  Ninja: 'Ninja',
  Katana: 'Katana',
  Shuriken: 'Shuriken'
}


const Katana = function () {
  this.hit = function () {
    return 'cut!'
  }
}
helpers.annotate(Katana)


const Shuriken = function () {
  this.throw = function () {
    return 'hit!'
  }
}

helpers.annotate(Shuriken);


const Ninja = function (katana, shuriken) {
  this._katana = katana;
  this._shuriken = shuriken;

  this.fight = function () {
    return this._katana.hit() 
  }

  this.sneak = function () {
    return this._shuriken.throw()
  }
}

helpers.annotate(Ninja, [TYPES.Katana, TYPES.Shuriken]);

// Declare bindings
var container = new inversify.Container()
container.bind(TYPES.Ninja).to(Ninja);
container.bind(TYPES.Katana).to(Katana);
container.bind(TYPES.Shuriken).to(Shuriken);

// Resolve dependencies
var ninja = container.get(TYPES.Ninja);
console.log(ninja.fight(), ninja.sneak());

let shiru = container.get(TYPES.Shuriken)
console.log(shiru.throw())
