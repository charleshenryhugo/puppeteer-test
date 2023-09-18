import express from 'express'
import * as prerender from './ssr.mjs'

/** @type {import ("puppeteer")} */
import puppeteer from 'puppeteer'

let browserWSEndpoint = null
const app = express()

async function initBrowserWSEndpoint() {
  if (!browserWSEndpoint) {
    const browser = await puppeteer.launch({
      executablePath: '.cache/puppeteer/chrome/mac-116.0.5845.96/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
      headless: 'new', // launch headless version
    })

    browserWSEndpoint = browser.wsEndpoint()
  }

  return browserWSEndpoint
}

// app.get('/favicon*', async (req, res) => {
//   return res.redirect('http://127.0.0.1:8080/favicon.ico')
// })

const updateCacheUrls = []
app.get('*', async (req, res) => {
  try {
    await initBrowserWSEndpoint()

    if (req.url === '/cron/update_cache') {
      const clearedCachedUrls = prerender.clearCache()
      updateCacheUrls.forEach(async (url) => {
        await prerender.render({ url, browserWSEndpoint })
      })

      return res.status(200).json({
        message: '🧹 Render Caches Updated!',
        clearedCachedUrls
      })
    }

    let url = req.url.slice(1)
    if (!req.url.slice(1)?.length) {
      url = `${req.protocol}://${req.get('host')}:8080`
    }

    console.info(`Headless Chrome will render: ${url}`)

    const { html, ttRenderMs } = await prerender.render({ url, browserWSEndpoint })

    // https://w3c.github.io/server-timing/
    /*
      On the client, the Performance Timeline API and/or PerformanceObserver can be used to access these metrics:
      const entry = performance.getEntriesByType('navigation').find(e => e.name === location.href);
      console.log(entry.serverTiming[0].toJSON());
     */
    res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless Chrome render time (ms)"`)
    return res.status(200).send(html)
  } catch (err) {
    console.log('😬', err)
    return res.status(400).send(err.message)
  }
})

app.listen(80, () => console.log('Server Started: http://127.0.0.1:80, press Ctrl+C to quit'))
