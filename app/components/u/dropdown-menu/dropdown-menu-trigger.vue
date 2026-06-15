<script lang="ts" setup>
import type { DropdownMenuTriggerProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuTriggerProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegatedProps)
</script>

<template>
  <DropdownMenuTrigger v-bind="forwarded" :class="cn('outline-none', props.class)" data-slot="dropdown-menu-trigger">
    <slot />
  </DropdownMenuTrigger>
</template>
