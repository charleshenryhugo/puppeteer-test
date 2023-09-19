// Example: evaluate script in the context of the page
/**
* @type {import ("puppeteer")}
*/
const puppeteer = require('puppeteer')

const dotenv = require('dotenv')
dotenv.config({ path: `.env.${process.env.NODE_ENV}`})

console.info(`Chrome path: ${process.env.CHROME_PATH}`)

;(async () => {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH,
    headless: 'new',
  })
  const page = await browser.newPage()

  const url = 'https://www.google.com'
  console.info(`👾 Evaluate script on ${url}`)
  
  await page.goto(url)

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