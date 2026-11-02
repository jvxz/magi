<script lang="ts" setup>
import type { AcceptableValue } from 'reka-ui'

import { useForwardExpose } from 'reka-ui'

import type { UToggleGroupRootProps } from '../toggle-group/root.vue'

import { INJECTION_KEY__DIALOG_SIDEBAR_LAYOUT_TITLE } from './sidebar-layout.vue'

export interface USidebarLayoutGroupProps extends UToggleGroupRootProps {
  defaultValue: AcceptableValue
}

const props = defineProps<USidebarLayoutGroupProps>()

const modelValue = defineModel<AcceptableValue>()
const modelValueStrict = computed({
  get: () => modelValue.value ?? props.defaultValue,
  set: value => {
    if (value) modelValue.value = value
  },
})

const headerTitle = inject(INJECTION_KEY__DIALOG_SIDEBAR_LAYOUT_TITLE, ref(''))
syncRef(modelValueStrict, headerTitle, { direction: 'ltr', immediate: true })

const { forwardRef } = useForwardExpose()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UToggleGroupRoot
    :ref="forwardRef"
    v-bind="delegated"
    v-model:model-value="modelValueStrict"
    :class="cn('size-full flex flex-col gap-1', props.class)"
    data-slot="sidebar-layout-group"
  >
    <slot :model-value="modelValueStrict" />
  </UToggleGroupRoot>
</template>
