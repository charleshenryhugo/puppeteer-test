// Example: evaluate script in the context of the page
/**
* @type {import ("puppeteer")}
*/
const puppeteer = require('puppeteer')

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: '.cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    headless: 'new',
  })
  const page = await browser.newPage()
  
  await page.goto('https://keiba.rakuten.co.jp')

  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      devicePixelRatio: window.devicePixelRatio,
    }
  })

  console.log({ dimensions })

  await browser.close()
})()