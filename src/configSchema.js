
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
      items: [
        {
          type: 'string'
        }
      ]
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
          items: [
            {
              type: 'string',
              format: 'bip39'
            }
          ]
        }
      },
      required: ['masterAccountPassword', 'delegates']
    },
    node: {
      type: 'object',
      properties: {
        directory: {
          type: 'string',
          format: 'file'
        },
        host: {
          type: 'string',
          minLength: 5
        },
        port: {
          type: 'integer'
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
    }
  },
  required: ['userDevDir', 'watch', 'dapp', 'node']
}

module.exports = schema
