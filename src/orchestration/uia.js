
// ctor
let UIA = function (config) {
  this.config = config

  this.start = () => {
    console.log(`config: ${JSON.stringify(config, null, 2)}`)
  }
}

module.exports = UIA
