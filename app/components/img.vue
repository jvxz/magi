<script lang="ts" setup>
import type { ImgHTMLAttributes } from 'vue'

export interface ImgProps extends ImgHTMLAttributes {
  src: string | undefined
  alt: string | undefined
  fallbackAlt?: string
  width?: number
  height?: number
  size?: number
}

// remove prefix prop from vue’s inherited HTML attrs
const { prefix, ...props } = defineProps<ImgProps>()

const error = shallowRef(false)
const loaded = shallowRef(false)
</script>

<template>
  <img
    v-bind="props"
    :loading="loading ?? 'lazy'"
    :alt="alt ?? fallbackAlt ?? 'Unknown image'"
    :width="size ?? width ?? 400"
    :height="size ?? height ?? 400"
    :src="(error || !loaded || !src) ? IMG_PLACEHOLDER_URL : src"
    :class="cn('select-none', !loaded && 'bg-muted', $props.class)"
    :data-loaded="loaded ? 'true' : 'false'"
    @load="(e) => {
      loaded = true
      onLoad?.(e)
    }"
    @error="(e) => {
      error = true
      onError?.(e)
    }"
  />
</template>
