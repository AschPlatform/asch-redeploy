
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
          minLength: 20
        },
        masterAccountPassword2nd: {
          type: 'string'
        },
        delegates: {
          type: 'array',
          minItems: 4,
          items: [
            {
              type: 'string'
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
          minLength: 3
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
          minLength: 15
        }
      },
      required: ['directory', 'host', 'port', 'magic', 'genesisAccount']
    }
  },
  required: ['userDevDir', 'watch', 'dapp', 'node']
}

module.exports = schema
