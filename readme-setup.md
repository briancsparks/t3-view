

# Setup

## Setting up the reverse proxy

Instructions are also at the top of the `local-rev-out.js` file.

```sh
cd ~/dev/b/bridge47
pm2  start /bridge47-plugins/local-rev-ou/local-rev-out.js -- --port=5777 --main

sudo nginx -t && sudo nginx
```

## Setting up the dev machine

The `package.json` file must have a `"proxy"` entry:

```
  "proxy": "http://local-1-4.mobilewebassist.net/",
```





