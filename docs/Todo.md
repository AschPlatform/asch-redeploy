# TODO
* Possible Refactoring
  * Merge the two methods in CreateLogDir into one
  * CopyDirectory doesn't need to be in own file. Easier to test when not in own file
  * Asch service returns the promise on exit only when the exit() event fired
  * Rename DI.resetConstants
* Refactoring:
  * rename `src/container.js` file into `src/DI.js`
  * Add "userDevDir" to schema object for validation
  * In container.js make shure, that all dependencies are getting unset and then reset on a call to reset()
* Is it necessary, to have the asch/public/dist folder build for "asch-redeploy" to work?
* Write tests
  * Add travis-ci build on commit!Add travis-ci build on commit!
  * Add `.travis.yml` file
* Uninstall old unused Dapps
  * Save on memory and asch startup time 
* Does silly-log-level works?
* Optimize delay times
  * Between transactions
  * Between startup/shutdowns
* Delete old dappId folders for start-up optimization
