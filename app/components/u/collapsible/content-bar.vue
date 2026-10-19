<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

import { injectCollapsibleRootContext } from 'reka-ui'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()

const { open } = injectCollapsibleRootContext()
</script>

<template>
  <button
    type="button"
    :class="cn('flex shrink-0 w-4 cursor-pointer items-center justify-center', props.class)"
    @click="open = !open"
  >
    <div
      class="rounded-full bg-border h-full w-px group-hover:bg-border-strong group-has-[[data-state=open]]:bg-border-strong"
    />
  </button>
</template>
