const DI = require('../../src/container')
const should = require('should')
const EventEmitter = require('events')

describe('watcher', function () {
  const container = DI.container
  const registerConstant = DI.helpers.registerConstantValue(container)

  beforeEach('setup', function () {
    // logger
    const Logger = {
      info (text, config) {
      },
      verbose (text, config) {
      }
    }
    DI.container.unbind(DI.DEPENDENCIES.Logger)
    registerConstant(DI.DEPENDENCIES.Logger, Logger)
  })

  afterEach('cleanup', function () {
    DI.resetConstants()
  })

  describe('happy path', function () {
    it('DI worked', function (done) {
      let startUpCheck = container.get(DI.FILETYPES.Watcher)
      should(startUpCheck).be.ok()
      should(startUpCheck).have.property('config')
      should(startUpCheck).have.property('logger')
      should(startUpCheck).have.property('chokidar')
      should(startUpCheck).have.property('moment')
      done()
    })

    it('call to watch() watches for file changes', function (done) {
      let Config = {
        watch: ['init.js, model/**.js']
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let Chokidar = {
        called: 0,
        params: [],
        watch (watchFor) {
          this.called += 1
          this.params = watchFor
          return new EventEmitter()
        }
      }
      container.unbind(DI.DEPENDENCIES.Chokidar)
      registerConstant(DI.DEPENDENCIES.Chokidar, Chokidar)

      let watcher = container.get(DI.FILETYPES.Watcher)
      watcher.watch()

      should(Chokidar).have.property('called')
      should(Chokidar.called).equals(1)
      should(Chokidar).have.property('params')
      should(Chokidar.params).deepEqual(Config.watch)
      done()
    })

    it('on file change will a new item be added to changedFiles Array', function (done) {
      let Config = {
        watch: ['init.js, model/**.js']
      }
      container.unbind(DI.DEPENDENCIES.Config)
      registerConstant(DI.DEPENDENCIES.Config, Config)

      let Chokidar = {
        emitter: new EventEmitter(),
        watch (watchFor) {
          return this.emitter
        },
        testEmit () {
          this.emitter.emit('all', 'add', 'domain.js')
        }
      }
      container.unbind(DI.DEPENDENCIES.Chokidar)
      registerConstant(DI.DEPENDENCIES.Chokidar, Chokidar)

      let watcher = container.get(DI.FILETYPES.Watcher)
      watcher.watch()

      Chokidar.testEmit()

      should(watcher).have.property('changedFiles')
      should(watcher.changedFiles.length).equals(1)
      should(watcher.changedFiles[0].event).equals('add')
      should(watcher.changedFiles[0].name).equals('domain.js')
      done()
    })

    it('return control after 10 seconds after the last file change occured', function (done) {
      // mock current time
      const Moment = function () {
        return {
          unix () {
            return 1001
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      let watcher = container.get(DI.FILETYPES.Watcher)
      watcher.changedFiles.push({
        event: 'add',
        name: 'test.js',
        time: 990
      })

      let result = watcher.shouldIWait()
      should(result).equals(false)
      done()
    })

    it('no file changed - continue to wait', function (done) {
      // mock current time
      const Moment = function () {
        return {
          unix () {
            return 1000
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      let watcher = container.get(DI.FILETYPES.Watcher)

      let result = watcher.shouldIWait()
      should(result).equals(true)
      done()
    })

    it('wait longer if last file change is shorter then 10 seconds ago', function (done) {
      // mock current time
      const Moment = function () {
        return {
          unix () {
            return 1000
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      let watcher = container.get(DI.FILETYPES.Watcher)
      watcher.changedFiles.push({
        event: 'add',
        name: 'test.js',
        time: 995
      })

      let result = watcher.shouldIWait()
      should(result).equals(true)
      done()
    })

    it('multiple file changes, consider only the last one', function (done) {
      // mock current time
      const Moment = function () {
        return {
          unix () {
            return 1000
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      let watcher = container.get(DI.FILETYPES.Watcher)

      // file changes
      watcher.changedFiles.push({
        event: 'add',
        name: 'test.js',
        time: 985
      })
      watcher.changedFiles.push({
        event: 'change',
        name: 'domain.js',
        time: 993
      })

      let result = watcher.shouldIWait()
      should(result).equals(true)
      done()
    })

    it('waitForFileChanges() returns promise', function (done) {
      // mock current time
      const Moment = function () {
        return {
          unix () {
            return 1000
          }
        }
      }
      container.unbind(DI.DEPENDENCIES.Moment)
      registerConstant(DI.DEPENDENCIES.Moment, Moment)

      // dummy Chokidar
      let Chokidar = {
        emitter: new EventEmitter(),
        watch (watchFor) {
          return this.emitter
        }
      }
      container.unbind(DI.DEPENDENCIES.Chokidar)
      registerConstant(DI.DEPENDENCIES.Chokidar, Chokidar)

      // no file changes
      let watcher = container.get(DI.FILETYPES.Watcher)

      // file changes
      watcher.changedFiles.push({
        event: 'add',
        name: 'test.js',
        time: 980
      })

      watcher.watch()

      let promise = watcher.waitForFileChanges(10)
        .then((result) => {
          should(promise).have.property('then')
          should(promise).have.property('catch')
          done()
        })
        .catch((error) => {
          throw error
        })
    })
  })

  describe('sad path', function () {
    it('throws exception if watch() is not called before waitForFileChanges', function (done) {
      let watcher = container.get(DI.FILETYPES.Watcher)

      watcher.waitForFileChanges(10)
        .then((result) => {
          throw new Error()
        })
        .catch((error) => {
          should(error.message).startWith('did_not_initialize')
          done()
        })
    })

    it('throws exception if watch() is called twice or more', function (done) {
      // dummy Chokidar
      let Chokidar = {
        emitter: new EventEmitter(),
        watch (watchFor) {
          return this.emitter
        }
      }
      container.unbind(DI.DEPENDENCIES.Chokidar)
      registerConstant(DI.DEPENDENCIES.Chokidar, Chokidar)

      let watcher = container.get(DI.FILETYPES.Watcher)
      watcher.watch()

      try {
        watcher.watch()
      } catch (error) {
        should(error.message).startWith('already_initialized')
        done()
      }
    })
  })
})
