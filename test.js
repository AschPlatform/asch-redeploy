
const moment = require('moment')

setInterval(() => {
  console.log(moment().unix())
}, 1000)

