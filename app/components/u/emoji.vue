<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export type UEmojiProps = (
  | {
      url: string | undefined
      alt?: string | undefined
    }
  | {
      unicode: string | undefined
    }
) & {
  class?: HTMLAttributes['class']
}

const props = defineProps<UEmojiProps>()

const shared = computed(() => ({
  class: cn('inline h-1lh max-w-24', props.class),
  'data-slot': 'emoji',
}))

const imageUrl = useResolveImageUrl(() => ('url' in props ? props.url : undefined), {
  resizeMethod: 'scale',
  size: 'small',
})
</script>

<template>
  <Twemoji v-if="'unicode' in props && props.unicode" :emoji="props.unicode" v-bind="shared" />
  <Img v-else-if="'url' in props && props.url" :src="imageUrl" :alt="props.alt ?? props.url" v-bind="shared" />
</template>
