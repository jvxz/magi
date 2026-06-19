<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from 'vue'

import type { UInputProps } from '../u/input.vue'
import type { FormPrimitiveProps } from './primitive.vue'

export interface FormInputProps extends FormPrimitiveProps, UInputProps {
  modelValue?: string | number
  ui?: DefineClasses<'container' | 'input'>
  type?: InputTypeHTMLAttribute
  placeholder?: string
}

const props = defineProps<FormInputProps>()
const modelValue = defineModel<string | number>()

const hasError = computed(() => (props.error && Array.isArray(props.error) ? props.error.length > 0 : !!props.error))
const delegated = reactiveOmit(props, ['placeholder', 'modelValue', 'placeholder', 'required'])
</script>

<template>
  <FormPrimitive v-bind="delegated" :class="$props.ui?.container">
    <UInput
      v-model="modelValue"
      :disable-pw
      :placeholder
      :type="$props.type"
      :class="cn(hasError && 'border-danger ring-danger', $props.ui?.input)"
    />
  </FormPrimitive>
</template>
