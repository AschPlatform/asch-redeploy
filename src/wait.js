

// ctor

let wait = function () {

  // this.new = function (ms) {
  //   ms = ms !== 'undefined' ? ms : 5000
  //   return new Promise (function () {
  //     console.log(`starting to wait for ${ms}ms`)
  //     setTimeout(function waitOnTimeOut() {
  //       console.log(`finished waiting ${ms}ms`)
  //       Promise.resolve(null)
  //     }, ms)
  //   })
  // }
  this.new = function (t, v) {
    return new Promise(function(resolve) { 
        setTimeout(resolve.bind(null, v), t)
    })
  }
}

module.exports = wait
