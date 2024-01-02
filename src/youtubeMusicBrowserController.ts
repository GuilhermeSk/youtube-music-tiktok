import { Page } from 'puppeteer'
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { sleep } from './utils/utils'
import { getTikTokLiveCreatorUser } from './utils/configs'

puppeteer.use(StealthPlugin())

export default class YoutubeMusicBrowserController {
  page: Page | null = null

  async initialize() {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({
      headless: false,
      userDataDir: './user-data',
      args: ['--start-maximized'],
      ignoreDefaultArgs: ['--hide-scrollbars'],
      defaultViewport: null
    })
    this.page = await browser.newPage()

    // Navigate the page to a URL
    await this.page.goto('https://music.youtube.com/')

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
  }

  async addMusic(music: string) {
    if (!this.page) {
      console.error('Page is not initialized')
      return
    }
    try {
      await this.page.evaluate(() => {
        // @ts-ignore
        document.querySelector('input.ytmusic-search-box').value = ''
      })
      await sleep(500)
      await this.page.type('input.ytmusic-search-box', music)
      this.page.keyboard.press('Enter')

      await this.page.waitForNavigation()

      const [songsLink] = await this.page.$x("//a[contains(., 'Songs')]")
      if (songsLink) {
        await songsLink.click()
      }

      await this.page.waitForNavigation()

      await this.addToQueue(music)
    } catch (error) {
      console.error(error)
    }
  }

  async skip(uniqueId: string, isModerator: boolean) {
    try {
      if (getTikTokLiveCreatorUser() === uniqueId || isModerator) {
        if (await this.isPlayingMusic()) {
          console.log('Skip song')
          this.page?.keyboard.press('j')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  async pause(uniqueId: string, isModerator: boolean) {
    try {
      if (getTikTokLiveCreatorUser() === uniqueId || isModerator) {
        if (await this.isPlayingMusic()) {
          console.log('Pause song')
          this.page?.keyboard.press('Space')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  async resume(uniqueId: string, isModerator: boolean) {
    try {
      if (getTikTokLiveCreatorUser() === uniqueId || isModerator) {
        if (!(await this.isPlayingMusic())) {
          console.log('Resume song')
          this.page?.keyboard.press('Space')
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  private async addToQueue(music: string) {
    if (!this.page) {
      console.error('Page is not initialized')
      return
    }
    try {
      await this.page.mouse.click(800, 230, { button: 'right' })

      await sleep(1000)

      await this.page.evaluate(() => {
        try {
          // @ts-ignore
          document.querySelector('tp-yt-paper-listbox').childNodes[4].click()
        } catch (e) {}
      })

      await this.checkIfMusicWasAdded(music)
    } catch (error) {
      console.error(error)
    }
  }

  private async checkIfMusicWasAdded(music: string, timeout = 5000) {
    if (!this.page) {
      console.error('Page is not initialized')
      return
    }
    try {
      await Promise.race([
        this.page.waitForFunction(
          // @ts-ignore
          text => document.body.innerText.includes(text),
          {},
          'Song added to queue'
        ),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Timeout: Text not found')),
            timeout
          )
        )
      ])
    } catch (error) {
      console.log(`Music not added: ${music}`)
    }
  }

  private async isPlayingMusic() {
    return (
      (await this.page?.$eval('#play-pause-button', el => el.title)) === 'Pause'
    )
  }
}
