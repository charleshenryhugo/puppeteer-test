/* eslint-disable no-debugger */
/**
 * @type {import ("puppeteer")}
 */
const puppeteer = require('puppeteer')

const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: '.cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: false, // launch a full version of chrome browser
    slowMo: 250, // Slows down Puppeteer operations by the specified amount of milliseconds to aid debugging
    devtools: true,
    args: [
      // ref: https://www.chromium.org/developers/design-documents/network-settings/
      '--proxy-pac-url=http://stg-m.keiba.rakuten.co.jp/proxy/stg1.pac'
    ]
  })

  const page = await browser.newPage()

  // capture console output
  page.on('console', (msg) => console.log(`PAGE CONSOLE ${msg.type()}: ${msg.text()}`))
  
  await page.goto('https://grp02.id.rakuten.co.jp/rms/nid/loginfwd?__event=LOGIN&service_id=n57&return_url=%2Flogin%2Fredirect%3Fm%3Di%26r%3Dhttps%2525253A%2525252F%2525252Fkeiba.rakuten.co.jp', {
    waitUntil: 'networkidle2',
  })

  await page.evaluate(() => {
    // debugger
    console.log(window.location.href)
    // debugger
    /* fill in user name and password to login */
    document.querySelector('#loginInner_u').value='rpat03'
    // debugger
    document.querySelector('#loginInner_p').value='aaaaaa'
    // debugger
    document.querySelector('input[value=Login][name=submit]').click()
  })

  await page.goto('https://keiba.rakuten.co.jp/switch_ui?ui_mode=new', {
    waitUntil: 'networkidle2'
  })

  // take a screenshot
  await page.screenshot({ path: 'outputs/keiba-spa.png' })

  const html = await page.content()

  // await browser.close()

  try {
    fs.writeFileSync('outputs/keiba-spa.html', html)
  } catch (e) {
    console.error(e)
  }
})()