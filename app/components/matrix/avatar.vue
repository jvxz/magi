<script setup lang="ts">
import { useForwardPropsEmits } from 'reka-ui'

import type { ImgEmits, ImgProps } from '~/components/img.vue'

export type MatrixAvatarProps = Omit<ImgProps, 'src' | 'size'> & {
  square?: boolean
  imageSize?: AvatarImageSize
  isLoading?: boolean
  src: string | undefined | null
}

export type MatrixAvatarEmits = ImgEmits

const props = withDefaults(defineProps<MatrixAvatarProps>(), {
  imageSize: 'small',
})
const emits = defineEmits<ImgEmits>()

const useFull = ref(false)
const src = useResolveAvatarUrl(
  () => props.src ?? undefined,
  () => ({
    size: useFull.value ? 'full' : props.imageSize,
  }),
)

const failed = ref(false)
watch(
  () => props.src,
  () => (useFull.value = false),
)
watch(src, () => (failed.value = false))

async function onError() {
  if (useFull.value || props.imageSize === 'full') return (failed.value = true)

  const before = src.value
  useFull.value = true

  await nextTick()
  if (src.value === before) failed.value = true
}

const delegated = reactiveOmit(props, ['doPlaceholder', 'square', 'fallbackAlt', 'alt'])
const forwarded = useForwardPropsEmits(delegated, emits)

const id = useId()
</script>

<template>
  <Img
    v-if="src && !failed"
    v-bind="forwarded"
    :alt
    :src
    :class="cn('object-cover', !square && 'rounded-full', props.class)"
    :do-placeholder="false"
    @error="onError"
  />
  <AvatarPlaceholder
    v-else
    :is-loading
    :name="alt ?? id"
    :square
    :class="cn(!square && 'rounded-full', 'size-full', props.class)"
  />
</template>
