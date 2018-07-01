
// ctor
let registerPublisher = function (config, aschJS, axios, logger, promise) {
  this.config = config
  this.aschJS = aschJS
  this.axios = axios
  this.logger = logger
  this.promise = promise

  this.existsPublisher = () => {
    let publicKey = this.aschJS.crypto.getKeys(this.config.dapp.masterAccountPassword).publicKey
    let address = this.aschJS.crypto.getAddress(publicKey)

    let url = `${config.node.host}:${config.node.port}/api/uia/issuers/${address}`

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
        "issuer": {
          "name":"CCTime",
          "desc":"asdf"
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
          throw new Error(`other_publisher_registered: There is already under this address a publisher registered "${response.data.issuer}". Delete the "asch/blockchain.db" file and repeat`)
        }
      } else {
        return true
      }
    }
  }

  this.register = () => {
    let publisher = this.config.uia.publisher

    let transaction = this.aschJS.uia.createIssuer(publisher, publisher, this.config.dapp.masterAccountPassword, this.config.dapp.masterAccountPassword2nd)

    let url = 'http://localhost:4096/peer/transactions'
    let data = {
      transaction: transaction
    }
    let headers = {
      headers: {
        magic: '594fe0f3',
        version: ''
      }
    }
    return axios.post(url, data, headers)
  }

  this.handleRegister = (response) => {
    if (response.status === 200 && response.data.success === true) {
      this.logger.info(`registered publisher ${this.config.uia.publisher}`, { meta: 'inverse' })
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
        return this.promise.delay(11000)
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