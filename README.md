# asch-redeploy
A hassle-free local asch environment

# Install
```bash
npm install -g asch-redeploy
```

# Usage
```bash
# clone a dapp repository
git clone https://github.com/aschplatform/asch-dapp-helloworld
cd asch-dapp-helloworld

# watch for changes
asch-redeploy .
```


# TODO
* Check with z-schema if every configuration is set
  * Print configuration
  * Do all config values exists (e.g folders, files...)
* Only watch on some folders and filetypes
  * Restart on changes
* Write current `<dappId>` into a file
* retry when not enough money
* BUG: Restart didn't worked! (after dapp registration)
* Do I need to create a softlink in asch/public/dapps? (I think the asch-binaries should be built before)
    * Softlink in /home/ma/asch/public/dist/dapps/a7ef9cd0707fe94f583334d434e39570113a43e3647c8ee730bf21ec2fe08c97
    * points to /home/ma/asch/dapps/a7ef9cd0707fe94f583334d434e39570113a43e3647c8ee730bf21ec2fe08c97/public
* Start asch-node only when stopped
* Create Symolink 

```bash
inln -s /home/matt/test/asch/dapps/efc789be7881c014773629eb955e527367d247e2885d6f00f6030137fc5e8d35/public /home/matt/test/asch/public/dist/dapps/efc789be7881c014773629eb955e527367d247e2885d6f00f6030137fc5e8d35
```


# Contributing
#### Error
If the following error displays:
 `Error: listen EADDRINUSE 0.0.0.0:4096`, this means the the asch-node is already running and must be terminated.

`fuser --kill 4096/tcp`

#### Install asch-redeploy local as global package
Type 
```bash
cd asch-redeploy
npm link
```
