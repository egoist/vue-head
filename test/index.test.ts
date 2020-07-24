import { test } from 'uvu'
import assert from 'uvu/assert'
import findChrome from 'chrome-finder'
import pptr from 'puppeteer-core'

test('main', async () => {
  const browser = await pptr.launch({
    headless: true,
    executablePath: findChrome(),
  })

  const page = await browser.newPage()
  await page.goto('http://localhost:4000')
  const title = await page.title()
  assert.is(title, 'title 3')
  await page.close()
  await browser.close()
})

test.run()
