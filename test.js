const moment = function () {
  return {
    unix () {
      return 1000
    }
  }
}

console.log(moment().unix())
