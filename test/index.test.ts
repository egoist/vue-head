import { test } from 'uvu'
import assert from 'uvu/assert'
import playwright from 'playwright-chromium'

test('main', async () => {
  const browser = await playwright.chromium.launch({
    headless: true,
  })

  const page = await browser.newPage()
  await page.goto('http://localhost:4000')
  const title = await page.title()
  assert.is(title, 'title 3')
  await page.close()
  await browser.close()
})

test.run()
