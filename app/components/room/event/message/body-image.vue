<script lang="ts" setup>
const props = defineProps<{
  mxcUrl: string
  alt?: string
  width?: number
  height?: number
}>()

// scale, not crop: custom emoji aren't always square
const src = useResolveImageUrl(() => props.mxcUrl, { resizeMethod: 'scale' })
</script>

<template>
  <Img class="align-middle inline" :src :alt :title="alt" :width :height />
</template>
