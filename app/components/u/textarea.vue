<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

const props = withDefaults(
  defineProps<{
    class?: HTMLAttributes['class']
    defaultValue?: string | number
    modelValue?: string | number
    disabled?: boolean
    resizable?: boolean
  }>(),
  {
    resizable: false,
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

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
