const DI = require('./src/container')
const Service = DI.container.get(DI.FILETYPES.Service)

Service.start()
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.log(error)
  })

setTimeout(() => {
  Service.stop()
}, 2000)
