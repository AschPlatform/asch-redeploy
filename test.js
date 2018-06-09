
let DI = require('./src/container')
let moment = require('moment')

let config = DI.container.get(DI.DEPENDENCIES.Config)

let Watcher = require('./src/orchestration/watcher')

let watcher = new Watcher(config)
watcher.watch()

watcher.waitInterval()
  .then((result) => {
    console.log(`result: ${result}`)
  })
  .catch((error) => {
    console.log(error)
  })

setTimeout(() => {
  watcher.changedFiles.push({
    name: 'hallo.js',
    event: 'add',
    time: moment().unix()
  })
}, 10000)
