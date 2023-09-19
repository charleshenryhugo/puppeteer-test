/**
 * @type {import ("puppeteer")}
 */
import puppeteer from 'puppeteer'
import urlModule from 'url'

/**
 * in memory cache of rendered pages
 */
const RENDER_CACHE = new Map()

/**
 * 
 * @param {{ url: String, browserWSEndpoint: String, needCache: Boolean, removeScriptTags: Boolean, blockResources: Boolean }} param0 
 * @returns {Promise<{ html: String, ttRenderMs: Number }>}
 */
export async function render({ url, browserWSEndpoint, needCache = true, removeScriptTags = true, blockResources = true }) {
  if (RENDER_CACHE.has(url)) {
    console.info('headless rendered page from cache')
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0}
  }

  const start = Date.now()

  console.info(`Connecting to existing Chrome instance: ${browserWSEndpoint}`)
  const browser = await puppeteer.connect({ browserWSEndpoint })
  const page = await browser.newPage()

  try {
    if (blockResources) {
      await setBlockResources(page)
    }

    const stylesheetContents = blockResources ? {} : await setStashStylesheets(page, url)

    // https://cloudlayer.io/blog/puppeteer-waituntil-options/
    await page.goto(url, { waitUntil: 'networkidle0' })

    if (!blockResources) {
      /* Replace all stylesheet links with Inline css */
      await replaceStylesWithInlineCss(page, stylesheetContents)
    }

    if (removeScriptTags) {
      setRemoveScriptTags(page)
    }

    /* ensure some element exists in the DOM */
    // await page.waitForSelector('#posts')

  } catch (err) {
    console.error(err)
    throw err
  }
  
  /* The full HTML contents of the page, including the DOCTYPE. */
  const html = await page.content()

  /* don't close the browser when connecting to an existing instance, instead, do page.close() */
  // await browser.close()
  await page.close()

  const ttRenderMs = Date.now() - start
  console.info(`headless rendered page in: ${ttRenderMs}ms`)

  if (needCache) {
    RENDER_CACHE.set(url, html)
  }

  return { html, ttRenderMs }
}

/**
 * Network requests that don't construct DOM are wasteful.
 * 
 * Tell browser to abort requests of these resources: 
 * 
 * images; fonts; stylesheets; media; analytics scripts
 * 
 * NOTICE: images, fonts, stylesheets, media resources will still get loaded on real user's browser.
 * 
 * @param {import ("puppeteer").Page} page 
 */
async function setBlockResources(page) {
  /* intercept network requests */
  await page.setRequestInterception(true)
  const mediaBlockList = ['stylesheet', 'image', 'media', 'font']
  const scriptBlockList = ['www.google-analytics.com', '/gtag/js', 'ga.js', 'analytics.js', 'ytag', 'sitecatalyst', 'rat-main', 'gtm']


  return page.on('request', (req) => {
    if (mediaBlockList.includes(req.resourceType()) || scriptBlockList.find((regex) => req.url().match(regex))) {
      req.abort()
      console.log(`🛑 ABORT ${req.resourceType()} request resource: `, req.url())
      return
    }

    console.log(`✅ CONTINUE ${req.resourceType()} request resource: `, req.url())
    req.continue()
  })
}

/**
 * Stash the responses of same origin stylesheets.
 * 
 * NOTE: if stylesheet requests are aborted in "setBlockResources", then in this function nothing will be stashed.
 * 
 * @param {import ("puppeteer").Page} page 
 * @param {String} requestUrl
 */
async function setStashStylesheets(page, requestedPageUrl) {
  const URL = urlModule.URL
  const stylesheetContents = {}

  /* page.on('response') listens for network responses */
  page.on('response', async (resp) => {
    const resourceResponseUrl = resp.url()
    const sameOrigin = new URL(resourceResponseUrl).origin === new URL(requestedPageUrl).origin
    const isStylesheet = resp.request().resourceType() === 'stylesheet'

    if (sameOrigin && isStylesheet) {
      stylesheetContents[resourceResponseUrl] = await resp.text()
    }
  })

  return stylesheetContents
}

/**
 * Replace all stylesheet links with Inline css.
 * 
 * NOTE: if stylesheet requests are aborted in "setBlockResources", then stylesheetContents is empty and no style tags will be replaced.
 * 
 * @param {import ("puppeteer").Page} page 
 * @param {{}} stylesheetContents 
 */
async function replaceStylesWithInlineCss(page, stylesheetContents) {
  await page.$$eval('link[rel="stylesheet"]', (links, contents) => {
    links.forEach((link) => {
      const cssText = contents[link.href]
      if (cssText) {
        const style = document.createElement('style')
        style.textContent = cssText
        link.replaceWith(style)
      }
    })
  }, stylesheetContents)
}

/**
 * Prevent re-hydration by removing all script tags from page
 * @param {import ("puppeteer").Page} page 
 */
async function setRemoveScriptTags(page) {
  return await page.evaluate(() => {
    document.querySelectorAll('script').forEach((scriptTag) => scriptTag.remove())
  })
}

/**
 * clear cache;
 * @returns {String[]} the cleared urls list
 */
export function clearCache() {
  const cachedUrls = []

  for (const url of RENDER_CACHE.keys()) {
    cachedUrls.push(url)
  }

  RENDER_CACHE.clear()

  return cachedUrls
}
