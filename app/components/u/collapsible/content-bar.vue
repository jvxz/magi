<script lang="ts" setup>
import { injectCollapsibleRootContext } from 'reka-ui'

export interface UCollapsibleContentBarProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UCollapsibleContentBarProps>()

const { open } = injectCollapsibleRootContext()
</script>

<template>
  <button
    type="button"
    :class="cn('flex shrink-0 w-4 cursor-pointer items-center justify-center', props.class)"
    @click="open = !open"
  >
    <div
      class="rounded-full bg-border h-full w-px group-has-[[data-state=open]]:bg-border-strong group-hover:bg-border-strong"
    />
  </button>
</template>
