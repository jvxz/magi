<script setup lang="ts">
import type { SelectGroupProps } from 'reka-ui'

import { SelectGroup } from 'reka-ui'

export type USelectGroupProps = SelectGroupProps

const props = defineProps<USelectGroupProps>()
</script>

<template>
  <SelectGroup data-slot="select-group" v-bind="props">
    <slot />
  </SelectGroup>
</template>
