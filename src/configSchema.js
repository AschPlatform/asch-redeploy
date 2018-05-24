
let schema = {
  type: 'object',
  properties: {
    watch: {
      type: 'array',
      minItems: 1
    },
    dapp: {
      type: 'object',
      properties: {
        masterAccountPassword: {
          type: 'string',
          minLength: 20
        },
        masterAccountPassword2nd: {
          type: 'string', // nullable,
          minLength: 0
        },
        delegates: {
          type: 'array',
          minItems: 5
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
          minLength: 5
        },
        genesisAccount: {
          type: 'string',
          minLength: 15
        }
      },
      required: ['directory', 'host', 'port', 'magic', 'genesisAccount']
    }
  },
  required: ['watch', 'dapp', 'node']
}

module.exports = schema
