const ncp = require('ncp').ncp

let copyDirectory = function (from, to, callback) {
  console.log(`copyDirectory:  \nfrom:${from}\nto:${to}`)
  ncp(from, to, callback)
}

module.exports = copyDirectory
