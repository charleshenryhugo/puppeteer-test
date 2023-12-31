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
    headless: 'new'
  })
  const page = await browser.newPage()

  const url = 'https://www.google.com'
  console.info(`📃 Download PDF of ${url}`)

  await page.goto(url, {
    waitUntil: 'networkidle2',
  })

  const outputPath = 'outputs/google.pdf'
  await page.pdf({ path: outputPath, format: 'A4'})
  console.log(`Output to ${outputPath}`)
  
  await browser.close()
})()