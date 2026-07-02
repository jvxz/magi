<script lang="ts" setup>
import type { SelectContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

import type { SortSelectModelValue, SortSelectRootProps } from './root.vue'
import type { SortSelectTriggerProps } from './trigger.vue'

const props = defineProps<
  SortSelectRootProps &
    SortSelectTriggerProps &
    Pick<SelectContentProps, 'collisionPadding' | 'sideOffset' | 'alignOffset'> & {
      ui?: DefineClasses<'trigger' | 'toggle' | 'content' | 'root'>
    }
>()
const emits = defineEmits<{
  'update:modelValue': [value: SortSelectModelValue]
}>()

const delegated = reactiveOmit(props, [
  'size',
  'reference',
  'variant',
  'disabled',
  'collisionPadding',
  'sideOffset',
  'alignOffset',
  'ui',
])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <USortSelectRoot v-bind="forwarded" :class="ui?.root" :disabled data-slot="sort-select">
    <USortSelectTrigger :class="ui?.trigger" :variant :size :reference :disabled />
    <USortSelectContent :class="ui?.content" :collision-padding :align-offset :side-offset />
    <USortSelectDirToggle :class="ui?.toggle" :variant :size :disabled />
  </USortSelectRoot>
</template>
