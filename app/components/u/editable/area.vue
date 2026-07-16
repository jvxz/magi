<script lang="ts">
export const editableAreaLeadingIconInjectionKey: InjectionKey<Ref<string | undefined>> =
  Symbol('editableAreaLeadingIcon')
</script>

<script lang="ts" setup>
import type { EditableAreaProps } from 'reka-ui'
import type { InjectionKey } from 'vue'

import { useForwardProps } from 'reka-ui'

export type UEditableAreaProps = EditableAreaProps & { class?: string; leadingIcon?: string }

const props = defineProps<UEditableAreaProps>()

provide(editableAreaLeadingIconInjectionKey, toRef(props, 'leadingIcon'))

const delegated = reactiveOmit(props, ['class', 'leadingIcon'])
const forwarded = useForwardProps(delegated)
</script>

<template>
  <EditableArea v-bind="forwarded" :class="cn('flex items-start', props.class)" data-slot="editable-area">
    <slot />
  </EditableArea>
</template>
