<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes, InputHTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'

export interface UInputTemplateRef {
  inputRef: HTMLInputElement | undefined
}
</script>

<script lang="ts" setup>
type Props = PrimitiveProps & {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  classes?: DefineClasses<'root' | 'input' | 'leadingIcon' | 'trailingIcon'>
  leadingIcon?: string
  trailingIcon?: string
} & Omit<InputHTMLAttributes, 'name' | 'type' | 'placeholder' | 'required' | 'autocomplete' | 'autofocus' | 'disabled' | 'class'>

const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})

const iconClass = 'text-muted-foreground h-[1em] absolute top-1/2 -translate-y-1/2'

const inputRef = useTemplateRef('inputRef')
defineExpose({
  inputRef,
})
</script>

<template>
  <Primitive v-bind="{ as, asChild }" :class="cn('relative', $props.class, $props.classes?.root)">
    <Icon
      v-if="props.leadingIcon"
      :name="props.leadingIcon"
      data-slot="leadingIcon"
      :class="cn(iconClass, 'left-2', classes?.leadingIcon)"
    />

    <input
      v-bind="$attrs"
      ref="inputRef"
      v-model="modelValue"
      :class="cn(
        staticStyles.base,
        interactiveStyles.size.default,
        staticStyles.variant.default,
        'flex w-full min-w-0 cursor-text truncate py-1 selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-muted-foreground focus-visible:ring-3 text-sm',
        props.leadingIcon && 'ps-7',
        props.trailingIcon && 'pe-7',
        $props.classes?.input,
      )"
    >

    <Icon
      v-if="props.trailingIcon"
      :name="props.trailingIcon"
      data-slot="trailingIcon"
      :class="cn(iconClass, 'right-2', classes?.trailingIcon)"
    />
  </Primitive>
</template>
