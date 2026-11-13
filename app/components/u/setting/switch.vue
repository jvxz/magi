<script lang="ts" setup>
import type { USettingCompositeProps } from './composite.vue'

export interface USettingSwitchProps extends USettingCompositeProps {
  modelValue?: boolean
}
export interface USettingSwitchEmits {
  'update:modelValue': [value: boolean]
}

const props = defineProps<USettingSwitchProps>()
const emits = defineEmits<USettingSwitchEmits>()

const delegated = reactiveOmit(props, 'modelValue')
const modelValue = useVModel(props, 'modelValue', emits, { passive: true })
</script>

<template>
  <USettingComposite v-slot="{ id }" v-bind="delegated" data-slot="setting-switch">
    <USwitch :id v-model="modelValue" />
  </USettingComposite>
</template>
