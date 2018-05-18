var shelljs = require('shelljs')

console.log(shelljs.pwd().stdout)

console.log(shelljs.pushd('/home/matt/test/asch').stdout)
console.log(shelljs.pushd('+1').stdout)
console.log(shelljs.popd().stdout)

console.log(shelljs.pwd().stdout)

console.log(shelljs.exec('./aschd start').stdout)

