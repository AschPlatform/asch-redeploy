
let schema = {
  type: 'object',
  properties: {
    peers: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'object',
        properties: {
          ip: {
            type: 'string'
          },
          port: {
            type: 'number'
          }
        },
        required: ['ip', 'port']
      }
    },
    secrets: {
      type: 'array',
      minItems: 3,
      items: {
        type: 'string'
      }
    }
  },
  required: ['peers', 'secrets']
}

module.exports = schema
