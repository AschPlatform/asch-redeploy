const DI = require('./src/container')

// const config = DI.container.get(DI.DEPENDENCIES.Config)
// console.log(config)

const startUpCheck = DI.container.get(DI.FILETYPES.StartUpCheck)
// console.log(startUpCheck)

startUpCheck.check()
  .then((result) => {
    console.log('got result')
    console.log(`result: ${result}`)
  })
  .catch((error) => {
    console.log('got error')
    console.log(error)
  })
