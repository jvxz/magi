<script setup lang="ts">
import type { TextareaHTMLAttributes } from 'vue'

export interface UTextareaEmits {
  (e: 'update:modelValue', payload: string | number): void
}
export interface UTextareaProps {
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  disabled?: boolean
  resizable?: boolean | 'x' | 'y'
  wrap?: TextareaHTMLAttributes['wrap']
}

const props = withDefaults(defineProps<UTextareaProps>(), {
  resizable: false,
  wrap: 'hard',
})

const emits = defineEmits<UTextareaEmits>()

const delegated = reactiveOmit(props, ['class', 'disabled', 'resizable'])
const modelValue = useVModel(delegated, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})
</script>

<template>
  <textarea
    v-bind="delegated"
    v-model="modelValue"
    data-slot="textarea"
    :disabled="disabled"
    :class="
      cn(
        inputStyles(),
        'h-42 field-sizing-content resize-none whitespace-pre-wrap text-clip',
        resizable === 'x' ? 'resize-x' : resizable === 'y' ? 'resize-y' : resizable ? 'resize' : '',
        props.class,
      )
    "
  />
</template>
