<script setup lang="ts">
import type { ContextMenuSeparatorProps } from 'reka-ui'

import { reactiveOmit } from '@vueuse/core'

const props = defineProps<ContextMenuSeparatorProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <ContextMenuSeparator v-bind="delegated" :class="cn('-mx-1 my-1 h-px bg-border-strong', props.class)" />
</template>
