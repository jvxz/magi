<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'

import { NodeViewWrapper } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>

<template>
  <NodeViewWrapper as="span" class="align-text-bottom inline-flex relative">
    <span class="text-transparent leading-none select-auto">{{ node.attrs.unicode }}</span>
    <span class="flex pointer-events-none items-center inset-0 justify-center absolute" aria-hidden="true">
      <Suspense v-if="node.attrs.hexcode">
        <Twemoji data-slot="twemoji" :emoji="node.attrs.hexcode" />
        <template #fallback />
      </Suspense>
    </span>
  </NodeViewWrapper>
</template>
