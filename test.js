const DI = require('./src/container')

const Axios = function () {
  this.post = function (url, config) {
    return new Promise((resolve, reject) => {
      console.log('I am in axios post')
      resolve(true)
    })
  }
}

DI.helpers.annotate(Axios)
DI.container.unbind(DI.DEPENDENCIES.Axios)
DI.container.bind(DI.DEPENDENCIES.Axios).to(Axios)

let sendMoney = DI.container.get(DI.FILETYPES.SendMoney)
console.log(sendMoney)
