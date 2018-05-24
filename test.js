// from http://hellote.com/dynamic-promise-chains/
const Promise = require('bluebird')

let ping = (num) => {
  return new Promise((resolve, reject) => {
    console.log(`ping ${num}`)
    resolve()
  })
}

let pong = (num) => {
  return new Promise((resolve, reject) => {
    console.log(`pong ${num}`)
    resolve()
  })
}

let recurse = (amount) => {
  // Base case - just return the promise
  if (amount === 0) {
    return amount
  }

  var next = null

  if (amount % 2 === 0) {
    next = ping
  } else {
    next = pong
  }

  return next(amount)
    .then(() => {
      return recurse(amount - 1)
    })
}

let start = () => {
  return new Promise((resolve, reject) => {
    resolve(10)
  })
}

start()
  .then(recurse)
