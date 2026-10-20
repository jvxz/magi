<script setup lang="ts">
import type { SelectItemTextProps } from 'reka-ui'

import { SelectItemText } from 'reka-ui'

export type USelectItemTextProps = SelectItemTextProps

const props = defineProps<USelectItemTextProps>()
</script>

<template>
  <SelectItemText data-slot="select-item-text" v-bind="props">
    <slot />
  </SelectItemText>
</template>
