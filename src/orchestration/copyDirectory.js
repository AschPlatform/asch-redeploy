const ncp = require('ncp').ncp

let copyDirectory = function (from, to, callback) {
  ncp(from, to, callback)
}

module.exports = copyDirectory
