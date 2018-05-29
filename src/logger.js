
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf } = format
const moment = require('moment')
const chalk = require('chalk')

let logger = createLogger()

let consoleLogLevel = 'info'
if (process.env['NODE_ENV'] === 'development') {
  consoleLogLevel = 'verbose'
}

const customFormat = printf(info => {
  let formattedDate = moment(info.timestamp).format('YYYY-MM-DD HH:mm:SSS')
  let level = info.level.toUpperCase()
  switch (level) {
    case 'SILLY':
      level = chalk.cyanBright(level)
      break
    case 'DEBUG':
      level = chalk.blueBright(level)
      break
    case 'VERBOSE':
      level = chalk.magenta(level)
      break
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
  return `[${formattedDate}][${level}] ${info.message}`
})

let con = new transports.Console({
  level: consoleLogLevel,
  timestamp: function (dat) {
    console.log(dat)
    return moment().format('YYYY-MM-DD HH:mm:SSS')
  },
  format: combine(
    timestamp(),
    customFormat
  )
})
logger.add(con)

// let file = new transports.File({
//   filename: 'asch-redeploy.log'
// })
// logger.add(file)

module.exports = logger
