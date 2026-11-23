<script lang="ts">
import type { MatrixEvent } from 'matrix-js-sdk'

import { UBlockquote } from '#components'

const tagComponentMap: Record<any, Component> = {
  blockquote: UBlockquote,
}
</script>

<script lang="ts" setup>
export interface RoomEventMessageBodyProps {
  event: MatrixEvent
}

const props = defineProps<RoomEventMessageBodyProps>()

const { messageNodes } = useMessageBodyNodes(() => props.event)

const isJumboEmoji = computed(() => isEmojiOnly(messageNodes.value))

const [DefineElement, Element] = createReusableTemplate<{
  node: MessageNode
}>({
  props: {
    node: {
      required: true,
      // prevent DOM pollution
      type: Object as PropType<MessageNode>,
    },
  },
})
</script>

<template>
  <DefineElement v-slot="{ node }">
    <!-- text -->
    <span v-if="node.type === 'text'" data-slot="text">{{ node.value }}</span>

    <!-- emoji -->
    <UEmoji v-else-if="node.type === 'emoji'" :unicode="node.unicode" :class="isJumboEmoji && 'text-4xl'" />
    <UEmoji
      v-else-if="node.type === 'custom-emoji'"
      :url="node.url"
      :alt="node.alt"
      :class="isJumboEmoji && 'text-4xl'"
    />

    <!-- codespan -->
    <UCodespan v-else-if="node.type === 'codespan'">{{ node.value }}</UCodespan>

    <!-- codeblock -->
    <UCodeblock
      v-else-if="node.type === 'codeblock'"
      :input="node.value"
      :lang="node.language"
      :header="true"
      :ui="{
        root: 'my-1 max-h-108 2xl:max-w-3/4',
      }"
    />

    <!-- link -->
    <UButton
      v-else-if="node.type === 'link'"
      data-slot="link"
      variant="link"
      class="text-primary mx-0 px-0 w-fit"
      :style="{
        'font-size': 'inherit',
      }"
      as-child
    >
      <NuxtLink :to="node.href" external target="_blank">
        <Element v-for="(child, index) in node.children" :key="index" :node="child" />
        <template v-if="!node.children.length">{{ node.href }}</template>
      </NuxtLink>
    </UButton>

    <!-- mention -->
    <RoomEventMessageBodyMention v-else-if="node.type === 'mention'" data-slot="mention" v-bind="node" />

    <!-- image -->
    <RoomEventMessageBodyImage
      v-else-if="node.type === 'image'"
      data-slot="image"
      :mxc-url="node.mxcUrl"
      :alt="node.alt"
      :width="node.width"
      :height="node.height"
    />

    <!-- element -->
    <component :is="tagComponentMap[node.tag] ?? node.tag" v-else-if="node.type === 'element'" v-bind="node.attrs">
      <Element v-for="(child, index) in node.children" :key="index" :node="child" />
    </component>
  </DefineElement>

  <article class="space-y-0.5">
    <Element v-for="(node, index) in messageNodes" :key="index" :node="node" />
  </article>
</template>

<style scoped>
:where(h1, h2, h3, h4, h5, p, ul, ol, blockquote, pre) + * {
  margin-block-start: 0.5em;
}

h2,
h3,
h4,
h5 {
  @apply font-medium;
}

h1 {
  @apply text-4xl font-semibold;
}
h2 {
  @apply text-3xl;
}
h3 {
  @apply text-2xl;
}
h4 {
  @apply text-xl;
}
h5 {
  @apply text-lg;
}

ul {
  @apply list-disc list-inside;
}
ol {
  @apply list-decimal list-inside;
}

strong {
  @apply font-bold;
}
</style>
