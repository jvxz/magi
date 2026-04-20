<script lang="ts" setup>
const props = defineProps<{
  content: string | undefined
}>()

const md = useMarked(() => props.content)
</script>

<template>
  <div v-bind="$attrs" v-html="md" />
</template>
