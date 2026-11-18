<script lang="ts">
export const INJECTION_KEY__EDITABLE_AREA_ICONS: InjectionKey<{
  leadingIcon: Ref<string | undefined>
  trailingIcon: Ref<string | undefined>
  hideIconsWhenActive: Ref<boolean>
}> = Symbol('editable-area-icons')
</script>

<script lang="ts" setup>
import type { EditableAreaProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type UEditableAreaProps = EditableAreaProps & {
  class?: HTMLAttributes['class']
  leadingIcon?: string
  trailingIcon?: string
  hideIconsWhenActive?: boolean
}

const props = withDefaults(defineProps<UEditableAreaProps>(), { hideIconsWhenActive: false })

provide(INJECTION_KEY__EDITABLE_AREA_ICONS, {
  hideIconsWhenActive: toRef(props, 'hideIconsWhenActive'),
  leadingIcon: toRef(props, 'leadingIcon'),
  trailingIcon: toRef(props, 'trailingIcon'),
})

const delegated = reactiveOmit(props, ['class', 'leadingIcon'])
const forwarded = useForwardProps(delegated)
</script>

<template>
  <EditableArea v-bind="forwarded" :class="cn('flex items-center gap-2', props.class)" data-slot="editable-area">
    <slot />
  </EditableArea>
</template>
