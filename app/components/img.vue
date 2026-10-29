<script lang="ts" setup>
import type { ImgHTMLAttributes } from 'vue'

export interface ImgProps {
  src: string | undefined
  alt: string | undefined
  fallbackAlt?: string
  width?: number
  height?: number
  size?: number
  class?: HTMLAttributes['class']
  loading?: ImgHTMLAttributes['loading']
  doPlaceholder?: boolean
  blurhash?: string
}

export interface ImgEmits {
  error: [event: Event]
  load: [image: HTMLImageElement]
  url: [url: string | undefined]
}

const props = defineProps<ImgProps>()
const emits = defineEmits<ImgEmits>()

const error = shallowRef(false)
const loaded = shallowRef(false)

watch(
  () => props.src,
  url => {
    emits('url', url)
    error.value = false
    loaded.value = false
  },
  { immediate: true },
)
</script>

<template>
  <UnLazyImage
    :key="src"
    :src
    :blurhash
    :placeholder-src="GENERAL__IMG_PLACEHOLDER_URL"
    :loading
    :alt="alt ?? fallbackAlt ?? 'Unknown image'"
    :width="size ?? width"
    :height="size ?? height"
    :style="(size ?? width) && (size ?? height) ? { aspectRatio: `${size ?? width} / ${size ?? height}` } : undefined"
    :class="
      cn(
        'select-none relative',
        'data-[loaded=false]:data-[error=false]:(bg-secondary-raised animate-pulse)',
        props.class,
      )
    "
    :data-loaded="loaded ? 'true' : 'false'"
    :data-error="error ? 'true' : 'false'"
    @image-load="
      (image: HTMLImageElement) => {
        loaded = true
        emits('load', image)
      }
    "
    @image-error="
      (_: HTMLImageElement, e: Event) => {
        error = true
        emits('error', e)
      }
    "
  />
</template>
