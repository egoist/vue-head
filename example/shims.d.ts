declare module '*.vue' {
  import { defineComponent } from 'vue'
  const comp: ReturnType<typeof defineComponent>
  export default comp
}
