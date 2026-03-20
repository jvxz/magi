<script lang="ts" setup>
import type { InputTypeHTMLAttribute } from 'vue'
import type { FormPrimitiveProps } from './primitive.vue'

export type FormInputProps = FormPrimitiveProps & {
  modelValue?: string | number
  ui?: DefineClasses<'container' | 'input'>
  type?: InputTypeHTMLAttribute
}

const props = defineProps<FormInputProps>()
const modelValue = defineModel<string | number>()

const hasError = computed(() => props.error && Array.isArray(props.error) ? props.error.length > 0 : !!props.error)
</script>

<template>
  <FormPrimitive v-bind="$props" :class="$props.ui?.container">
    <UInput
      v-model="modelValue"
      :type="$props.type"
      :class="cn(hasError && 'border-danger ring-danger', $props.ui?.input)"
    />
  </FormPrimitive>
</template>
