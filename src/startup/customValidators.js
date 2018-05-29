const ZSchema = require('z-schema')
const Mnemonic = require('bitcore-mnemonic')
const fs = require('fs')
const chalk = require('chalk')
const log = console.log

ZSchema.registerFormat('bip39', (secret) => {
  let isBip39 = false
  try {
    isBip39 = Mnemonic.isValid(secret)
  } catch (err) {
    log(chalk.red(`secret "${secret}" is not bip39 complient`))
    log(chalk.red(err.message))
    throw err
  }
  return isBip39
})

ZSchema.registerFormat('aschNodeDirectory', (dir) => {
  console.log(dir)
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
    throw new Error(`the asch directory ${dir} doesn't exist`)
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
  let exists = fs.existsSync(filePath)
  if (exists === true) {
    return true
  } else {
    throw new Error(`file ${filePath} doesn't exist`)
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
