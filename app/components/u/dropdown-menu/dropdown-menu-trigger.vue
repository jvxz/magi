<script lang="ts" setup>
import type { DropdownMenuTriggerProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<DropdownMenuTriggerProps>()

const forwarded = useForwardProps(props)
</script>

<template>
  <DropdownMenuTrigger v-bind="forwarded" :class="cn('outline-none', $attrs.class)" data-slot="dropdown-menu-trigger">
    <slot />
  </DropdownMenuTrigger>
</template>
