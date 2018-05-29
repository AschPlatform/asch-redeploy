
const winston = require('winston')
const moment = require('moment')
const chalk = require('chalk')

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: function () {
        return moment().format('YYYY-MM-DD HH:mm:SSS')
      },
      formatter: function (options) {
        var message = ''

        if (options.message !== undefined) {
          message = options.message
        }

        var meta = ''

        if (options.meta && Object.keys(options.meta).length) {
          meta = '\n\t' + JSON.stringify(options.meta)
        }

        var level = options.level.toUpperCase()

        switch (level) {
          case 'INFO':
            level = chalk.cyan(level)
            break

          case 'WARN':
            level = chalk.yellow(level)
            break

          case 'ERROR':
            level = chalk.red(level)
            break

          default:
            break
        }

        var output = [
          '[' + options.timestamp() + '][' + level + ']',
          message,
          meta
        ]

        return output.join(' ')
      }
    })
  ]
})
