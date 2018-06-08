// let fork = require('child_process')
// let mockFs = require('mock-fs')
// let fs = require('fs')

// mockFs.restore()

// // let logFile = '/test.js'

// mockFs({
//   'test.js': 'console.log("test")'
// })

// // let logStream = fs.openSync(logFile, 'a')

// let result = require('./test.js')
// eval(result)

// console.log(result)

let moment = require('moment')

let myMoment = function () {
  return moment.utc('2017-01-01T01:00:00')
}

console.log(myMoment().format('YYYY-MM-DD'))
