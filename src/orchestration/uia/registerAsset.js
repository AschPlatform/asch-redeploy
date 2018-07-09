
// ctor
let RegisterAsset = function (config, aschJS, axios, logger, promise) {
  this.config = config
  this.aschJS = aschJS
  this.axios = axios
  this.logger = logger
  this.promise = promise

  this.waitingMS = 11000

  this.existsAsset = () => {
    let url = `${this.config.node.host}:${this.config.node.port}/api/uia/assets/${this.config.uia.publisher}.${this.config.uia.asset}`

    return axios.get(url)
  }

  this.handleExistsAsset = (result) => {
    /*
      http://localhost:4096/api/uia/assets/CCtime.XCT
      response assetExists: {
        "success":true,
        "asset": {
          "name":"CCtime.XCT",
          "desc":"xct",
          "maximum":"10000000000000",
          "precision":8,
          "strategy":"",
          "quantity":"0",
          "height":20,
          "issuerId":"AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB",
          "acl":0,
          "writeoff":0,
          "allowWriteoff":0,
          "allowWhitelist":0,
          "allowBlacklist":0,
          "maximumShow":"100000",
          "quantityShow":"0"
        }
      }
      response assetExistsNot: {
        "success":false,
        "error":"Asset not found"
      }
    */

    if (result.status === 200) {
      if (result.data.success === true) {
        throw new Error('already_registered')
      } else {
        return true
      }
    } else {
      throw new Error('could_not_load_assets')
    }
  }

  this.register = () => {
    let name = `${config.uia.publisher}.${config.uia.asset}`
    let desc = name
    let maximum = '1000000000000000000'
    let precision = 8
    let strategy = ''
    let allowWriteoff = 0
    let allowWhitelist = 0
    let allowBlacklist = 0

    let transaction = aschJS.uia.createAsset(name, desc, maximum, precision, strategy, allowWriteoff, allowWhitelist, allowBlacklist, this.config.dapp.masterAccountPassword, this.config.dapp.masterAccountPassword2nd)

    let url = `${this.config.node.host}:${this.config.node.port}/peer/transactions`
    let data = {
      transaction: transaction
    }
    let headers = {
      headers: {
        magic: this.config.node.magic,
        version: ''
      }
    }

    return axios.post(url, data, headers)
  }

  this.handleRegister = (response) => {
    if (response.data.success === true) {
      let asset = this.config.uia.asset
      this.logger.info(`asset "${asset}" registered`, { meta: 'inverse' })
      return true
    }
  }

  this.start = () => {
    return this.existsAsset()
      .then((response) => {
        return this.handleExistsAsset(response)
      })
      .then((response) => {
        return this.register()
      })
      .then((response) => {
        return this.handleRegister(response)
      })
      .then(() => {
        this.logger.info(`waiting 11 sec for asset registration transaction to be written in block...`)
        return this.promise.delay(this.waitingMS)
      })
      .then(() => {
        return true
      })
      .catch((error) => {
        if (error.message.startsWith('already_registered')) {
          return true
        } else {
          throw error
        }
      })
  }
}

module.exports = RegisterAsset
