import { createApp, h } from 'vue'
import { createHead } from '../src'
import App from './App.vue'

const app = createApp({
  render: () => [h(App), h('br'), h('div')],
})
const head = createHead()
app.use(head)

app.mount('#app')
