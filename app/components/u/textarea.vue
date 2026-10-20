<script setup lang="ts">
export interface UTextareaEmits {
  (e: 'update:modelValue', payload: string | number): void
}
export interface UTextareaProps {
  class?: HTMLAttributes['class']
  defaultValue?: string | number
  modelValue?: string | number
  disabled?: boolean
  resizable?: boolean
}

const props = withDefaults(defineProps<UTextareaProps>(), {
  resizable: false,
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
    :aria-disabled="disabled"
    :class="cn(inputStyles(), 'h-42 field-sizing-content resize-none', resizable && 'resize', props.class)"
  />
</template>
