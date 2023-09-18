/**
* @type {import ("puppeteer")}
*/
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: '.cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: 'new'
  })
  const page = await browser.newPage()
  
  await page.goto('https://keiba.rakuten.co.jp')
  await page.screenshot({ path: 'outputs/keiba.png' })

  await browser.close()
})()