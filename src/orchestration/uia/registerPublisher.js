
/* errors:
  {"success":false,"error":"Double register"}
*/

// ctor
let registerPublisher = function (config, aschJS, axios, logger) {
  this.config = config
  this.aschJS = aschJS
  this.axios = axios
  this.logger = logger

  this.register = () => {
    let publicKey = this.aschJS.crypto.getKeys(this.config.dapp.masterAccountPassword).publicKey
    let address = this.aschJS.crypto.getAddress(publicKey)

    let url = `${config.node.host}:${config.node.port}/api/uia/issuers/${address}`

    return axios.get(url)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === true) {
            if (this.config.uia.publisher === response.data.issuer.name) {
              throw new Error('publisher_exists')
            } else {
              throw new Error(`other_publisher_registered: There is already under this address a publisher registered "${response.data.issuer}". Delete the "asch/blockchain.db" file and repeat`)
            }
          } else {
            return this.config.uia.publisher
          }
          // otherPublisherAlreadyRegistered -> ERROR {"success":true,"issuer":{"name":"KCM","desc":"KCM"}}
          // samepublisherAlreadyREgistered: {"success":true,"issuer":{"name":"CCTime","desc":"asdf"}}
          // noPublisherRegistered: {"success":false,"error":"Issuer not found"}
        }
      })
      .then((publisher) => {
        this.logger.info(`starting to register publisher: "${publisher}"`)
        return this.registerPublisher(publisher)
      })
      .catch((error) => {
        if (error.message.startsWith('publisher_exists')) {
          return true
        } else {
          throw error
        }
      })
  }

  this.registerPublisher = (publisher) => {
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
      .then((response) => {
        if (response.status === 200 && response.data.success === true) {
          return true
        } else {
          throw new Error(`Could not registered publisher, ${JSON.stringify(response.data, null, 2)}`)
        }
      })
  }
}

module.exports = registerPublisher
