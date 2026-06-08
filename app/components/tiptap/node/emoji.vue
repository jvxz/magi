<script lang="ts" setup>
import type { NodeViewProps } from '@tiptap/vue-3'

import { NodeViewWrapper } from '@tiptap/vue-3'

defineProps<NodeViewProps>()
</script>

<template>
  <NodeViewWrapper as="span" class="inline-flex align-text-bottom relative">
    <span class="select-auto text-transparent leading-none">{{ node.attrs.unicode }}</span>
    <span class="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
      <Suspense v-if="node.attrs.hexcode">
        <Twemoji data-slot="twemoji" :emoji="node.attrs.hexcode" />
        <template #fallback />
      </Suspense>
    </span>
  </NodeViewWrapper>
</template>
