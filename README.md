# @egoist/vue-head

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

const app = createApp()
const appHTML = await renderToString(app)
const headHTML = await renderToString(h(Fragment, app.headTags))

const finalHTML = `
<html>

<head>${headHTML}</head>

<body>${appHTML}</body>

</html
`
```

## TODO

- Testing
- Support `bodyAttrs`, `htmlAttrs`

## License

MIT &copy; [EGOIST](https://github.com/egoist/vue-head)
