# CORS Security Bypass

Developers can open Chrome in a special mode to 'bypass' CORS restrictions. Simply put the following script in your `~/.bashrc`:

```bash
function openChrome() {

    open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security``

}
```
