
let schema = {
  type: 'object',
  properties: {
    userDevDir: {
      type: 'string',
      minLength: 5
    },
    watch: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string'
      }
    },
    dapp: {
      type: 'object',
      properties: {
        masterAccountPassword: {
          type: 'string',
          format: 'bip39'
        },
        masterAccountPassword2nd: {
          type: 'string'
        },
        delegates: {
          type: 'array',
          minItems: 5,
          uniqueItems: true,
          items: {
            type: 'string',
            format: 'bip39'
          }
        }
      },
      required: ['masterAccountPassword', 'delegates']
    },
    node: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          format: 'aschNodeDirectory'
        },
        host: {
          type: 'string',
          minLength: 5
        },
        port: {
          type: 'string',
          format: 'port'
        },
        magic: {
          type: 'string',
          minLength: 3
        },
        genesisAccount: {
          type: 'string',
          format: 'bip39'
        }
      },
      required: ['directory', 'host', 'port', 'magic', 'genesisAccount']
    },
    output: {
      type: 'object',
      properties: {
        file: {
          type: 'string'
        }
      }
    }
  },
  uia: {
    type: 'object',
    properties: {
      publisher: {
        type: 'string'
      },
      asset: {
        type: 'string'
      },
      maximum: {
        type: 'string'
      },
      precision: {
        type: 'integer'
      }
    },
    required: ['publisher', 'asset']
  },
  required: ['userDevDir', 'watch', 'dapp', 'node']
}

module.exports = schema
