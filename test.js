const DI = require('./src/container')
const Prom = DI.container.get(DI.DEPENDENCIES.Promise)

let calling = function () {
  return new Promise((resolve, reject) => {
    reject(new Error('this is an error'))
  })
}

calling()
  .then((result) =>  {
    console.log('result' + result)
  })
  .catch((error) => {
    console.log('catched')
    console.log(error)
  })
