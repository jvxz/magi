<script setup lang="ts">
import type { SelectValueProps } from 'reka-ui'

import { SelectValue } from 'reka-ui'

export type USelectValueProps = SelectValueProps

const props = defineProps<USelectValueProps>()
</script>

<template>
  <SelectValue data-slot="select-value" v-bind="props">
    <slot />
  </SelectValue>
</template>
