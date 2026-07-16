<script lang="ts" setup>
import type { EditableRootEmits, EditableRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UEditableRootProps = EditableRootProps & { class?: string }
export type UEditableRootEmits = EditableRootEmits

const props = withDefaults(defineProps<UEditableRootProps>(), {
  submitMode: 'both',
})
const emits = defineEmits<UEditableRootEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <EditableRoot v-bind="forwarded" :class="props.class" data-slot="editable-root" v-slot="props">
    <slot v-bind="props" />
  </EditableRoot>
</template>
