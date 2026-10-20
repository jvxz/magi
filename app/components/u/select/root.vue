<script setup lang="ts" generic="T extends AcceptableValue = AcceptableValue">
import type { AcceptableValue, SelectRootEmits, SelectRootProps } from 'reka-ui'

import { SelectRoot, useForwardPropsEmits } from 'reka-ui'

export type USelectRootProps<T extends AcceptableValue = AcceptableValue> = SelectRootProps<T>
export type USelectRootEmits<T extends AcceptableValue = AcceptableValue> = SelectRootEmits<T>

const props = defineProps<USelectRootProps<T>>()
const emits = defineEmits<USelectRootEmits<T>>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <SelectRoot v-slot="slotProps" data-slot="select" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </SelectRoot>
</template>
