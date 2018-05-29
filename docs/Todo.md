# TODO

* Logs should log to userDevdir
   * One log-file for verbose console output
   * And one log-file for asch-node output 
   * Add date output
* Use winston-logging library
    * Use to files in the log-folders for asch-node and asch-redeploy output
* Overwrite NODE_ENV
* Output asch balance
* Prettify console output!
  * Consistent output
* Write tests
  * Add travis-ci build on commit!
  * Add `.travis.yml` file
* Optimize delay times
  * Between transactions
  * Between startup/shutdowns
* retry when not enough money
* Add GIF-Image to README.md to show usage and console output
* ~~Start asch-node on the port that was provided per Environment-variable ASCH_NODE_PORT~~
   * ~~app.js must be called with `node app.js --port 5000`~~
* ~~Only watch on some folders and filetypes~~
  * ~~Restart on changes~~
* ~~Refactor directory structure~~
  * ~~More sub-directory in src/~~
* ~~Track how many times the orchestrate function was called~~
* ~~Check if port is already in use [link](https://www.npmjs.com/package/is-port-available)~~
* ~~Overwrite configuration in file~~
* ~~What happens if a the watcher is watching for changes in model/**js but a .txt file is added~~
* ~~On the first run the watchers shouldn't run twice! (BUG)~~
   * ~~On first orchestration there are already pending tasks! Delete them!~~
* ~~Do I need to create a softlink in asch/public/dapps? (I think the asch-binaries should be built before)~~
   * ~~Softlink in /home/ma/asch/public/dist/dapps/a7ef9cd0707fe94f583334d434e39570113a43e3647c8ee730bf21ec2fe08c97~~
   * ~~points to /home/ma/asch/dapps/a7ef9cd0707fe94f583334d434e39570113a43e3647c8ee730bf21ec2fe08c97/public~~
      * No
* ~~Write dappId to file~~
   * ~~Add new configuration setting~~
   * ~~add new custom validation "file", check if file exists~~
* Create Sybolic-link 
```bash
inln -s /home/matt/test/asch/dapps/efc789be7881c014773629eb955e527367d247e2885d6f00f6030137fc5e8d35/public /home/matt/test/asch/public/dist/dapps/efc789be7881c014773629eb955e527367d247e2885d6f00f6030137fc5e8d35
```
