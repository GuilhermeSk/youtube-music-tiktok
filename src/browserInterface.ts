import { Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { sleep } from './utils/utils'

puppeteer.use(StealthPlugin())

async function addMusic(page: Page, music: string) {
  await page.type('input.ytmusic-search-box', music)
  page.keyboard.press('Enter')

  await page.waitForNavigation()

  const [songsLink] = await page.$x("//a[contains(., 'Songs')]")
  if (songsLink) {
    await songsLink.click()
  }

  await page.waitForNavigation()

  await sleep(10000)

  await addToQueue(page)
}

async function addToQueue(page: Page) {
  await page.mouse.click(500, 230, { button: 'right' })

  await sleep(1000)

  await page.evaluate(() => {
    try {
      // @ts-ignore
      document.querySelector('tp-yt-paper-listbox').childNodes[4].click()
    } catch (e) {}
  })
}

async function isPlayingMusic(page: Page) {
  return (await page.$eval('#play-pause-button', el => el.title)) === 'Pause'
}

;(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: './user-data',
    ignoreDefaultArgs: ['--hide-scrollbars']
  })
  const page = await browser.newPage()

  // Navigate the page to a URL
  await page.goto('https://music.youtube.com/')

  // await browser.close();
  process.on('uncaughtException', async error => {
    console.error('Uncaught Exception:', error)
    if (browser) await browser.close()
    process.exit(1) // Optional: Exit process after handling the error
  })

  process.on('SIGINT', async () => {
    console.log('SIGINT signal received.')
    if (browser) await browser.close()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received.')
    if (browser) await browser.close()
    process.exit(0)
  })
})()

module.exports = {
  addMusic
}
