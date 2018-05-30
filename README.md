# asch-redeploy
A hassle-free local asch environment. Watch for changes on your Dapp and re-deploy it automatically.

# Install
```bash
git clone https://github.com/a1300/asch-redeploy

# use asch-redeploy as a global package
cd asch-redeploy
npm install
npm link # important
```

# Usage
```bash
# clone a dapp repository
git clone https://github.com/aschplatform/asch-dapp-helloworld
cd asch-dapp-helloworld

# watch for changes
asch-redeploy                                     # in asch-dapp-helloworld

###################################################
### you can set different ENVIRONMENT variables ###
###################################################

# point to asch-directory (whtere app.js file lives)
ASCH_NODE_DIR='/pathToAschDir' asch-redeploy

# start asch-node on different port
ASCH_NODE_PORT='5000' asch-redeploy

# write dappId to file (for frontend-development)
OUTPUT_FILE='/home/user/asch-dapp-helloworld/src/dappConfig.json' asch-redeploy



# or use all together
ASCH_NODE_DIR='/pathToAschDir' \
ASCH_NODE_PORT='5000' \
OUTPUT_FILE='/home/user/asch-dapp-helloworld/src/dappConfig.json' asch-redeploy
```


[Tutorial](./docs/Tutorial.md)

# Folder Structure
Your work directory should have the following structure
```
/home/user
└───────asch
        └───app.js
        └───aschd
└───────asch-dapp-helloworld
        └───(run asch-redeploy here)
└───────asch-redeploy
```
