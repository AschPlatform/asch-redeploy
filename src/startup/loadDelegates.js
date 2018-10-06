
// ctor
const LoadDelegates = function (config, path, fs, inquirer, logger) {
  this.config = config
  this.path = path
  this.fs = fs
  this.inquirer = inquirer
  this.logger = logger

  this.default = [
    'flame bottom dragon rely endorse garage supply urge turtle team demand put',
    'thrive veteran child enforce puzzle buzz valley crew genuine basket start top',
    'black tool gift useless bring nothing huge vendor asset mix chimney weird',
    'ribbon crumble loud chief turn maid neglect move day churn share fabric',
    'scan prevent agent close human pair aerobic sad forest wave toe dust'
  ]

  this.load = () => {
    let configJsonPath = path.join(this.config.userDevDir, 'config.json')
    let stringContent = this.fs.readFileSync(configJsonPath, 'utf8')
    let content = JSON.parse(stringContent)

    if (!content.secrets || !Array.isArray(content.secrets)) {
      throw new Error('you need an "config.json" file an secrets array property')
    }

    return new Promise((resolve, reject) => {
      resolve(content)
    })
      .then((content) => {
        if (content.secrets.length === 0) {
          this.logger.info(`\nconfig.json: ${JSON.stringify(content, null, 2)}`, { meta: 'inverse' })
          return inquirer.prompt([
            {
              name: 'fillConfig',
              type: 'confirm',
              message: 'No secrets in config.json. Should it be filled with default secrets?'
            }
          ])
            .then((answers) => {
              return this.processAnswers(answers, content, configJsonPath)
            })
        } else {
          return true
        }
      })
  }

  this.processAnswers = (answers, content, configJsonPath) => {
    if (!answers.fillConfig) {
      throw new Error('You need to provide valid secrets in the "config.json" file')
    }

    content.secrets = this.default
    fs.writeFileSync(configJsonPath, JSON.stringify(content, null, 2))

    this.config.dapp.delegates = content.secrets
    return true
  }
}

module.exports = LoadDelegates
