<script setup lang="ts">
import type { DropdownMenuGroupProps } from 'reka-ui'

export type UDropdownMenuGroupProps = DropdownMenuGroupProps

const props = defineProps<UDropdownMenuGroupProps>()
</script>

<template>
  <DropdownMenuGroup v-bind="props">
    <slot />
  </DropdownMenuGroup>
</template>
