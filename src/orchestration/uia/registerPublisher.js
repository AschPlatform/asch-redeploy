
// ctor
let registerPublisher = function (config, aschJS, axios, logger, promise) {
  this.config = config
  this.aschJS = aschJS
  this.axios = axios
  this.logger = logger
  this.promise = promise

  this.waitingMS = 12000

  this.existsPublisher = () => {
    let publisher = this.config.uia.publisher

    let url = `${config.node.host}:${config.node.port}/api/uia/issuers/${publisher}`

    return axios.get(url)
  }

  this.handleExistsPublisher = (response) => {
    /*
      otherPublisherAlreadyRegistered -> ERROR {
        "success":true,
        "issuer":{
          "name":"KCM",
          "desc":"KCM"
        }
      }
      samepublisherAlreadyRegistered: {
        "success":true,
        "issuer":{
          "tid":"eda3df08875f2d967b6c44a3e913221315ea29f583e4405cd6c0ca6a77017ecf","name":"CCTime",
          "issuerId":"AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB",
          "desc":"CCTime",
          "_version_":1
        }
      }
      noPublisherRegistered: {
        "success":false,
        "error":"Issuer not found"
      }
    */

    if (response.status === 200) {
      if (response.data.success === true) {
        if (this.config.uia.publisher === response.data.issuer.name) {
          throw new Error('publisher_exists')
        } else {
          throw new Error(`other_publisher_registered: There was already the publisher "${response.data.issuer.name}" under this account registered. Reset your Asch blockchain as you delete the "blockchain.db" file in the "asch/" directory!`)
        }
      } else {
        return true
      }
    }
  }

  this.register = () => {
    let publisher = this.config.uia.publisher

    let trs = {
      secret: this.config.dapp.masterAccountPassword,
      secondSecret: this.config.dapp.masterAccountPassword2nd,
      type: 100,
      fee: 100 * 1e8,
      args: [ publisher, publisher ]
    }

    let url = `${this.config.node.host}:${this.config.node.port}/api/transactions`
    let headers = {
      headers: {
        magic: this.config.node.magic,
        version: ''
      }
    }
    return axios.put(url, trs, headers)
  }

  this.handleRegister = (response) => {
    if (response.status === 200 && response.data.success === true) {
      this.logger.info(`registered publisher "${this.config.uia.publisher}"`, { meta: 'inverse' })
      return true
    } else {
      throw new Error(`Could not register publisher, ${JSON.stringify(response.data, null, 2)}`)
    }
  }

  this.start = () => {
    return this.existsPublisher()
      .then((response) => {
        return this.handleExistsPublisher(response)
      })
      .then((publisher) => {
        return this.register(publisher)
      })
      .then((response) => {
        return this.handleRegister(response)
      })
      .then(() => {
        this.logger.info('waiting 11 sec for publisher registration transaction to be persisted in block...')
        return this.promise.delay(this.waitingMS)
      })
      .then(() => {
        return true
      })
      .catch((error) => {
        if (error.message.startsWith('publisher_exists')) {
          return true
        } else {
          throw error
        }
      })
  }
}

module.exports = registerPublisher
