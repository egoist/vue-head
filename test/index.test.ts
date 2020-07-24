import { test } from 'uvu'
import assert from 'uvu/assert'
import findChrome from 'chrome-finder'
import pptr from 'puppeteer-core'
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'

let ps: ChildProcessWithoutNullStreams | undefined

test.before(() => {
  ps = spawn('yarn', ['vite'])
})

test.after(() => {
  ps?.kill()
})

test('main', async () => {
  const browser = await pptr.launch({
    headless: false,
    executablePath: findChrome(),
  })

  const page = await browser.newPage()
  await page.goto('http://localhost:3000')
  const title = await page.title()
  assert.is(title, 'title 3')
})

test.run()
