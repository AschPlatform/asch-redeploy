# TODO
* If many file changes occur, wait 10 after the last file change for further file changes
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
* Logs
   * Create one log-file for verbose console output
   * And one log-file for asch-node output 
   * Add date output
* Does silly-log-level works?
* Overwrite NODE_ENV
* Consistent output
* Optimize delay times
  * Between transactions
  * Between startup/shutdowns
* retry when not enough money
* Delete old dappId folders for start-up optimization
