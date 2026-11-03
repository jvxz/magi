<script lang="ts" setup generic="T extends string">
import type { USettingCompositeProps } from './composite.vue'

export interface USettingSelectProps<T extends string> extends USettingCompositeProps {
  options?: T[]
  modelValue?: T
}
export interface USettingSelectEmits<T extends string> {
  'update:modelValue': [value: T]
}

const props = defineProps<USettingSelectProps<T>>()
const emits = defineEmits<USettingSelectEmits<T>>()

const delegated: USettingCompositeProps = reactiveOmit(props, ['options', 'modelValue'])
const modelValue = useVModel(props, 'modelValue', emits, { passive: true }) as Ref<T | undefined>
</script>

<template>
  <USettingComposite v-slot="{ id }" v-bind="delegated" data-slot="setting-select">
    <USelectRoot v-model:model-value="modelValue">
      <USelectTrigger :id class="min-w-48">
        <USelectValue>
          <slot name="selectValue" :model-value>{{ modelValue }}</slot>
        </USelectValue>
      </USelectTrigger>

      <USelectContent>
        <USelectItem v-for="option in options" :key="option" :value="option">
          <USelectItemText>
            {{ option }}
          </USelectItemText>
        </USelectItem>
      </USelectContent>
    </USelectRoot>
  </USettingComposite>
</template>
