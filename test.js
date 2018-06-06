const DI = require('./src/container')

const Axios = {
  post (url, config) {
    return new Promise((resolve, reject) => {
      console.log('I am in axios post')
      resolve(true)
    })
  }
}

const registerConstantValue = DI.helpers.registerConstantValue(DI.container)
DI.container.unbind(DI.DEPENDENCIES.Axios)
registerConstantValue(DI.DEPENDENCIES.Axios, Axios)

// DI.helpers.annotate(Axios)
// DI.container.unbind(DI.DEPENDENCIES.Axios)
// DI.container.bind(DI.DEPENDENCIES.Axios).to(Axios)

let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)
sendMoney.axios.post('hallo', { my: 'el' })
  .then((result) => {
    console.log(`result: ${result}`)
  })

// Axios.post('test', { myData: 'hello' })
//   .then((result) => {
//     console.log(`result: ${result}`)
//   })
