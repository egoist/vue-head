<template>
  <Head>
    <title>title 1</title>
    <title>title 2</title>
    <title>title 3</title>
    <meta name="description" content="hello" />
    <meta name="description" content="actual hello" />
  </Head>
  <div id="mounted"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Head } from '../src'

export default defineComponent({
  components: {
    Head,
  },
})
</script>
