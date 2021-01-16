import { test } from 'uvu'
import assert from 'uvu/assert'
import { h, createSSRApp, Fragment } from 'vue'
import { renderToString } from '@vue/server-renderer'
import playwright from 'playwright-chromium'
import { createHead, Head } from '../src'

test('browser', async () => {
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

test('server', async () => {
  const app = createSSRApp({
    setup() {
      return () => (
        <div>
          <Head>
            <title>hi</title>
            <meta name="description" content="desc" />
            <meta name="description" content="actual desc" />
          </Head>
        </div>
      )
    },
  })

  const head = createHead()

  app.use(head)

  await renderToString(app)
  const html = await renderToString(
    h(Fragment, app.config.globalProperties.$head.headTags),
  )

  assert.is(
    html,
    `<!--[--><title data-head-ssr>hi</title><meta data-head-ssr name="description" content="actual desc"><!--]-->`,
  )
})

test.run()
