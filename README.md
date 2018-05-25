# asch-redeploy
A hassle-free local asch environment

# Install
```bash
npm install -g asch-redeploy@0.0.1
```

# Folder Structure
Your work directory should have the following structure
```
/home/user
└───────asch
        └───app.js
        └───aschd
└───────asch-dapp-helloworld
        └───(run asch-redeploy here)
```

# Usage
```bash
# clone a dapp repository
git clone https://github.com/aschplatform/asch-dapp-helloworld
cd asch-dapp-helloworld

# watch for changes
asch-redeploy .
```



