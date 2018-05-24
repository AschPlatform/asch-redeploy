
let checkArch = () => {
  if (process.platform !== 'linux') {
    throw new Error('This program can currently run only on linux')
  }
}

module.exports = checkArch
