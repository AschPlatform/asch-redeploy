const axios = require('axios')
const Bottle = require('bottlejs')

let bottle = new Bottle()

console.log(bottle)
bottle.service('axios', axios)

bottle.service.axios.get('https://www.google.at')
  .then(function (response) {
    console.log(response.data)
  })
  .catch(function (error) {
    console.log(error)
  })
