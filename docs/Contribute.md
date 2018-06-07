# Contributing

## Environment Variable
Be sure to set the following environment variables for development
```
NODE_ENV = 'development'

# example command-line
NODE_ENV='development' node index.js

# example for Visual Studio Code
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Error
If the following error displays:
 `Error: listen EADDRINUSE 0.0.0.0:4096`, this means the the asch-node is already running and must be terminated.

`fuser --kill 4096/tcp`

## Local installation of asch-redeploy
Type 
```bash
cd asch-redeploy
npm link
```

## Run tests
```bash
npm test
```
