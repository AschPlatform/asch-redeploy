# Contributing
## Error
If the following error displays:
 `Error: listen EADDRINUSE 0.0.0.0:4096`, this means the the asch-node is already running and must be terminated.

`fuser --kill 4096/tcp`

## Install asch-redeploy local as global package
Type 
```bash
cd asch-redeploy
npm link
```
