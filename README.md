# @egoist/vue-head

[![npm version](https://badgen.net/npm/v/@egoist/vue-head)](https://npm.im/@egoist/vue-head) [![size](https://badgen.net/bundlephobia/minzip/@egoist/vue-head)](https://bundlephobia.com/result?p=@egoist/vue-head)

Document `<head>` manager for Vue 3, SSR ready. (Experimental)


## Install

```bash
yarn add @egoist/vue-head
```

## Usage

Apply this plugin to your Vue instance:

```js
import { createApp } from 'vue'
import { createHead } from '@egoist/vue-head'

const app = createApp()
const head = createHead()

app.use(head)
```

Use the `<Head>` component to add tags to `<head>`:

```vue
<template>
  <Head>
    <title>Hello Vue</title>
    <meta name="description" content="Do you like it?" />
  </Head>
</template>

<script>
import { Head } from '@egoist/vue-head'

export default {
  components: {
    Head,
  },
}
</script>
```

## SSR Usage

On your server:

```js
import { createApp, h, Fragment } from 'vue'
import { renderToString } from '@vue/server-renderer'

const app = createApp()
const appHTML = await renderToString(app)
const headHTML = await renderToString(
  h(Fragment, app.config.globalProperties.$head.headTags)
)

const finalHTML = `
<html>

<head>${headHTML}</head>

<body>${appHTML}</body>

</html
`
```

## How does it work

On the client-side, head tags are `<Teleport>`-ed to `document.head` element.

On the server-side, head tags are stored as a VNode array, so you can render them to HTML using `Vue.renderToString`.

## TODO

- Testing
- Support `bodyAttrs`, `htmlAttrs`

## Prior Art

Inspired by `react-head`.

## License

MIT &copy; [EGOIST](https://github.com/egoist/vue-head)
