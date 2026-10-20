<script setup lang="ts">
import type { DropdownMenuSeparatorProps } from 'reka-ui'

const props = defineProps<
  DropdownMenuSeparatorProps & {
    class?: HTMLAttributes['class']
  }
>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <DropdownMenuSeparator v-bind="delegatedProps" :class="cn('-mx-1 my-1 h-px bg-border-strong', props.class)" />
</template>
