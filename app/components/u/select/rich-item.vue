<script lang="ts" setup>
import type { SelectItemEmits } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

import type { USelectItemProps } from './item.vue'

export type USelectRichItemProps = USelectItemProps & { class?: HTMLAttributes['class'] }
export type USelectRichItemEmits = SelectItemEmits

const props = defineProps<USelectRichItemProps>()
const emits = defineEmits<USelectRichItemEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <USelectItem v-bind="forwarded" :class="cn('h-fit gap-1 items-start', props.class)" data-slot="select-rich-item">
    <slot />
  </USelectItem>
</template>
