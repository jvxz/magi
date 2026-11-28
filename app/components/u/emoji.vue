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
  twemojiRender?: 'svg' | 'png'
}

const props = withDefaults(defineProps<UEmojiProps>(), {
  twemojiRender: 'png',
})

const shared = computed(() => ({
  class: cn('inline h-1lh max-w-24', props.class),
  'data-slot': 'emoji',
}))

const { getTwemojiUrl } = useTwemoji()

const imageUrl = useResolveImageUrl(() => ('url' in props ? props.url : undefined), {
  resizeMethod: 'scale',
  size: 'small',
})
</script>

<template>
  <Img
    v-if="'unicode' in props && props.unicode"
    v-bind="shared"
    :src="getTwemojiUrl({ unicode: props.unicode })"
    :alt="props.unicode"
  />
  <Img v-else-if="'url' in props && props.url" :src="imageUrl" :alt="props.alt ?? props.url" v-bind="shared" />
</template>
