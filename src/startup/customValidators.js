const ZSchema = require('z-schema')
const Mnemonic = require('bitcore-mnemonic')
const fs = require('fs')
const logger = require('../logger')

ZSchema.registerFormat('bip39', (secret) => {
  let isBip39 = false
  try {
    isBip39 = Mnemonic.isValid(secret)
  } catch (err) {
    logger.error(`secret "${secret}" is not bip39 complient`)
    logger.error(err.message)
    throw err
  }
  return isBip39
})

ZSchema.registerFormat('aschNodeDirectory', (dir) => {
  let exists = fs.existsSync(dir)

  if (exists === true) {
    let isDirectory = fs.lstatSync(dir).isDirectory()
    if (isDirectory === true) {
      let file = fs.readdirSync(dir)
        .filter(file => {
          return file === 'app.js'
        })
      if (file && file.length === 1) {
        return true
      } else {
        throw new Error(`in the asch directory ${dir} doesn't exist a file "app.js"`)
      }
    } else {
      throw new Error(`${dir} is not a directory`)
    }
  } else {
    throw new Error(`the asch directory ${dir} doesn't exist. Try to set the Asch directory with the --asch option!`)
  }
})

ZSchema.registerFormat('port', (rawPort) => {
  let port = parseInt(rawPort)
  if (isNaN(port)) {
    throw new Error(`port "${rawPort}" is not an integer`)
  }
  if (port >= 1 && port <= 65535) {
    return true
  } else {
    throw new Error(`port "${port}" is not in the range of 1 and 65535`)
  }
})

ZSchema.registerFormat('file', (filePath) => {
  if (process.env['NODE_ENV'] === 'development') {
    logger.verbose(`skipping check for file "${filePath}"`)
    return true
  }

  if (filePath === '') {
    return true
  }

  let exists = fs.existsSync(filePath)
  if (exists === true) {
    return true
  } else {
    throw new Error(`file "${filePath}" doesn't exist`)
  }
})

let areNewFormatsRegistered = () => {
  var registeredFormats = ZSchema.getRegisteredFormats()
  return registeredFormats &&
    registeredFormats.indexOf('bip39') > -1 &&
    registeredFormats.indexOf('aschNodeDirectory') > -1 &&
    registeredFormats.indexOf('port') > -1 &&
    registeredFormats.indexOf('file') > -1
}

module.exports = {
  areNewFormatsRegistered
}
