
const { createLogger, format, transports } = require('winston')
const { combine, timestamp, printf, label } = format
require('winston-daily-rotate-file')
const moment = require('moment')
const chalk = require('chalk')

let logger = createLogger()

let styleText = function (text, meta) {
  if (meta) {
    console.log(`meta: ${meta}`)
    let result = eval(meta) // eslint-disable-line
    text = result(text)
  }
  return text
}

const customFormat = printf(info => {
  let formattedDate = moment(info.timestamp).format('YYYY-MM-DD HH:mm:SSS')
  let level = info.level.toUpperCase()
  let chalkMessageBuild = ['chalk']
  switch (level) {
    case 'SILLY':
      level = chalk.cyanBright(level)
      chalkMessageBuild.push('cyanBright')
      break
    case 'DEBUG':
      level = chalk.blueBright(level)
      chalkMessageBuild.push('blueBright')
      break
    case 'VERBOSE':
      level = chalk.magenta(level)
      chalkMessageBuild.push('magenta')
      break
    case 'INFO':
      level = chalk.cyan(level)
      chalkMessageBuild.push('cyan')
      break
    case 'WARN':
      level = chalk.yellow(level)
      chalkMessageBuild.push('yellow')
      break
    case 'ERROR':
      level = chalk.red(level)
      chalkMessageBuild.push('red')
      break
    default:
      break
  }

  if (info.meta && info.meta.length > 1) {
    let separated = info.meta.split('.')
    chalkMessageBuild.push(...separated)
  }
  let styles = chalkMessageBuild.join('.')

  let message = styleText(info.message, styles)

  // pass metadata to logger -> logger.info('test', { meta: 'meta' })
  let output = `[${chalk.blue(formattedDate)}][${level}] ${message}`
  return output
})

let consoleLogLevel = 'info'
if (process.env['NODE_ENV'] === 'development') {
  consoleLogLevel = 'verbose'
}

let con = new transports.Console({
  level: consoleLogLevel,
  format: combine(
    label(),
    timestamp(),
    customFormat
  ),
  colorize: process.stdout.isTTY
})
logger.add(con)

var dailyRotatefile = new (transports.DailyRotateFile)({
  filename: 'asch-redeploy-%DATE%.log',
  dirname: 'logs',
  datePattern: 'YYYY-MM-DD',
  level: 'silly'
})
logger.add(dailyRotatefile)

module.exports = logger
