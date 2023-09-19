# testing puppeteer apis

## First install modules
```
$ yarn install
```

headless chrome will be installed into path like: `.cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`, as specified in `.puppeteerrc.cjs`.

## Then we can run some examples
Fix the `CHROME_PATH` value in `.env.local`, and then try running these

```
$ NODE_ENV=local node examples/evaluate-script.cjs

Chrome path: .cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
👾 Evaluate script on https://www.google.com
{ dimensions: { width: 800, height: 600, devicePixelRatio: 1 } }
```

```
$ NODE_ENV=local node examples/screenshot.cjs

Chrome path: .cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
📸 Take screenshot on https://www.google.com
Output to outputs/google.png
```

```
$ NODE_ENV=local node examples/pdf.cjs

Chrome path: .cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
📃 Download PDF of https://www.google.com
Output to outputs/google.pdf
```

## prerender pages with headless chrome
```
$ yarn serve:headless-chrome

$ NODE_ENV=local nodemon ./prerender-pages-with-headless-chrome/server.mjs
[nodemon] 3.0.1
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: js,mjs,cjs,json
[nodemon] starting `node ./prerender-pages-with-headless-chrome/server.mjs`
Chrome path: .cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
Server Started: http://127.0.0.1:80, press Ctrl+C to quit
```

Access `http://127.0.0.1/https://www.google.com`

Logs:
```
Chrome path: .cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing
Server Started: http://127.0.0.1:80, press Ctrl+C to quit

Headless Chrome will render: https://keiba.rakuten.co.jp
Connecting to existing Chrome instance: ws://127.0.0.1:9222/devtools/browser/2eead669-9a5f-41b1-96d5-6c1f90f63451
✅ CONTINUE document request resource:  https://keiba.rakuten.co.jp/
🛑 ABORT stylesheet request resource:  https://keiba.r10s.jp/assets/css/top.css?id=6c764f73c83f65760c37
🛑 ABORT stylesheet request resource:  https://keiba.r10s.jp/ts_css/common/banner_list.css?id=202107121715
...
✅ CONTINUE script request resource:  https://connect.facebook.net/signals/config/767608823576544?v=2.9.127&r=stable&domain=keiba.rakuten.co.jp
🛑 ABORT image request resource:  https://www.facebook.com/tr/?id=767608823576544&ev=PageView&dl=https%3A%2F%2Fkeiba.rakuten.co.jp%2F&rl=&if=false&ts=1695104187733&sw=1792&sh=1120&v=2.9.127&r=stable&a=sig&ec=0&o=158&it=1695104187501&coo=false&rqm=GET
✅ CONTINUE ping request resource:  https://www.facebook.com/tr/
headless rendered page in: 10532ms
```
(images and css resources are aborted on server side)


Access `http://127.0.0.1/https://www.google.com` again, it will use cache and return html quickly

Logs:
```
Headless Chrome will render: https://www.google.com
headless rendered page from cache
```

## clear prerenderred cache
```
http://127.0.0.1/cron/update_cache

{
  "message": "🧹 Render Caches Updated!",
  "clearedCachedUrls": [
    "https://www.google.com"
  ]
}
```
