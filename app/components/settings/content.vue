<script lang="ts" setup>
const props = defineProps<{
  category: SettingsCategory
}>()

const Content = defineAsyncComponent(async () => {
  try {
    const c = await import(`~/components/settings/content/${props.category}.vue`)
    return c
  }
  catch {
    return h('div', { innerHTML: `Please create ~/components/settings/content/${props.category}.vue` })
  }
})
</script>

<template>
  <Content />
</template>
