<script lang="ts" setup>
import type { HTMLAttributes, ImgHTMLAttributes } from 'vue'

export interface ImgProps {
  src: string | undefined
  alt: string | undefined
  fallbackAlt?: string
  width?: number
  height?: number
  size?: number
  class?: HTMLAttributes['class']
  loading?: ImgHTMLAttributes['loading']
  onLoad?: (e: Event) => void
  onError?: (e: Event) => void
  doPlaceholder?: boolean
}

const props = defineProps<ImgProps>()

const error = shallowRef(false)
const loaded = shallowRef(false)

watch(() => props.src, () => {
  error.value = false
  loaded.value = false
})

function handleCached(e: any) {
  const el = e.el as HTMLImageElement
  if (!(el instanceof HTMLImageElement))
    return

  if (el.complete && el.naturalWidth > 0)
    loaded.value = true
}
</script>

<template>
  <span
    class="relative after:bg-card after:size-full after:content-[''] after:inset-0 after:absolute"
    :class="{
      'after:invisible': !error && !doPlaceholder,
    }"
  >
    <img
      v-bind="props"
      :loading="loading ?? 'lazy'"
      :alt="alt ?? fallbackAlt ?? 'Unknown image'"
      :width="size ?? width ?? 400"
      :height="size ?? height ?? 400"
      :src="!src ? IMG_PLACEHOLDER_URL : src"
      :class="cn(
        'select-none relative',
        !loaded && 'bg-muted',
        $props.class,
      )"
      :data-loaded="loaded ? 'true' : 'false'"
      :data-error="error ? 'true' : 'false'"
      @load="(e: Event) => {
        loaded = true
        onLoad?.(e)
      }"
      @error="(e) => {
        error = true
        onError?.(e)
      }"
      @vue:mounted="handleCached"
    />
  </span>
</template>
