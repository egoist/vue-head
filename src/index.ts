import {
  App,
  inject,
  ref,
  onMounted,
  onUnmounted,
  defineComponent,
  h,
  Teleport,
  VNode,
} from 'vue'
import { isVoidTag, hasOwn } from '@vue/shared'

const PROVIDE_KEY = `__head__`

type Attrs = {
  [k: string]: string | boolean
}

type MetaObj = {
  name?: string
  [k: string]: any
}

export interface HeadObject {
  title?: string
  meta?: MetaObj[]
  bodyAttrs?: Attrs
}

type Indices = {
  [tag: string]: number
}

const canUseDOM = typeof window !== 'undefined' && window.document

const injectHead = () => {
  const head = inject<HeadProvider>(PROVIDE_KEY)

  if (!head) {
    throw new Error(`You may forget to apply app.use(head)`)
  }

  return head
}

export type Options = {
  ssrAttribute?: string
}

export class HeadProvider {
  cascadingTags: {
    // tag: array of name or property value
    [tag: string]: Array<string | undefined>
  }
  headTags: VNode[]

  indices: Indices

  // Clean head tags when mounted
  cleaned?: boolean

  options: Required<Options>

  constructor(options: Options = {}) {
    this.options = {
      ssrAttribute: 'data-head-ssr',
      ...options,
    }
    this.cascadingTags = {
      title: [],
      meta: [],
    }
    this.indices = {}
    this.headTags = []
  }

  install(app: App) {
    app.config.globalProperties.$head = this
    app.provide(PROVIDE_KEY, this)
  }

  addClientTag(tag: string, name?: string) {
    // consider only cascading tags
    if (this.cascadingTags[tag]) {
      this.cascadingTags[tag].push(name)
      // track indices synchronously
      const { indices } = this
      const index = hasOwn(indices, tag) ? indices[tag] + 1 : 0
      indices[tag] = index
      return index
    }
    return -1
  }

  removeClientTag(tag: string, index: number) {
    const names = this.cascadingTags[tag]
    if (names) {
      names[index] = undefined
    }
  }

  shouldRenderTag(tag: string, index: number) {
    const names = this.cascadingTags[tag]
    if (names) {
      // check if the tag is the last one of similar
      return names && names.lastIndexOf(names[index]) === index
    }
    return true
  }

  addServerTag(tagNode: VNode) {
    if (canUseDOM) return
    const { headTags = [] } = this
    // tweak only cascading tags
    if (typeof tagNode.type === 'string' && this.cascadingTags[tagNode.type]) {
      const index = headTags.findIndex((prev) => {
        const prevName = prev.props?.name || prev.props?.property
        const nextName = tagNode.props?.name || tagNode.props?.property
        return prev.type === tagNode.type && prevName === nextName
      })
      if (index !== -1) {
        headTags.splice(index, 1)
      }
    }
    headTags.push(tagNode)
  }
}

const HeadTag = defineComponent({
  name: 'HeadTag',

  inheritAttrs: false,

  props: {
    tag: {
      type: String,
      required: true,
    },
    attrs: {
      type: Object,
      required: true,
    },
  },

  setup({ tag, attrs }, { slots }) {
    const head = injectHead()
    const index = ref(-1)
    const mounted = ref(false)
    onMounted(() => {
      index.value = head.addClientTag(tag, attrs.name || attrs.property)
      mounted.value = true
    })
    onUnmounted(() => {
      head.removeClientTag(tag, index.value)
    })

    return () => {
      const children = slots.default && slots.default()
      if (!canUseDOM) {
        const node = h(
          tag,
          { [head.options.ssrAttribute]: '', ...attrs },
          children,
        )
        head.addServerTag(node)
        return null
      }
      // Render tag of the last one similar
      // And it should be rendered after first render, a.k.a mounted
      // To get rid of SSR mismatching warning
      if (!mounted.value || !head.shouldRenderTag(tag, index.value)) {
        return null
      }
      return h(
        Teleport,
        { to: document.head },
        h(tag, { ...attrs }, isVoidTag(tag) ? undefined : children),
      )
    }
  },
})

export const Head = defineComponent({
  name: 'Head',
  
  inheritAttrs: false,

  setup() {
    const head = injectHead()

    // Remove server-rendered tags
    onMounted(() => {
      if (!head.cleaned) {
        head.cleaned = true
        // <title> should always be removed
        // Since you should manage them using this plugin
        const ssrTags = document.head.querySelectorAll(
          `[${head.options.ssrAttribute}=""], title`,
        )
        // `forEach` on `NodeList` is not supported in Googlebot, so use a workaround
        Array.prototype.forEach.call(ssrTags, (ssrTag) =>
          ssrTag.parentNode.removeChild(ssrTag),
        )
      }
    })
  },

  render() {
    const children = this.$slots.default && this.$slots.default()
    if (!children) {
      return null
    }
    return children
      .filter((child) => typeof child.type === 'string')
      .map((child) =>
        h(
          HeadTag,
          {
            tag: child.type as string,
            attrs: { ...child.props },
          },
          () => child.children,
        ),
      )
  },
})

export const createHead = (options: Options = {}) => new HeadProvider(options)
