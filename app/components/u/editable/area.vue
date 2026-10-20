<script lang="ts">
export const INJECTION_KEY__EDITABLE_AREA_LEADING_ICON: InjectionKey<Ref<string | undefined>> =
  Symbol('editableAreaLeadingIcon')
</script>

<script lang="ts" setup>
import type { EditableAreaProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type UEditableAreaProps = EditableAreaProps & { class?: HTMLAttributes['class']; leadingIcon?: string }

const props = defineProps<UEditableAreaProps>()

provide(INJECTION_KEY__EDITABLE_AREA_LEADING_ICON, toRef(props, 'leadingIcon'))

const delegated = reactiveOmit(props, ['class', 'leadingIcon'])
const forwarded = useForwardProps(delegated)
</script>

<template>
  <EditableArea v-bind="forwarded" :class="cn('flex items-start', props.class)" data-slot="editable-area">
    <slot />
  </EditableArea>
</template>
