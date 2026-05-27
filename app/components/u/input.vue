<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { useVModel } from '@vueuse/core'
import { useForwardExpose } from 'reka-ui'

export interface UInputRef extends ComponentPublicInstance {
  $el: HTMLInputElement | undefined
}

export type UInputProps = PrimitiveProps & {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  classes?: DefineClasses<'root' | 'input' | 'leadingIcon' | 'trailingIcon'>
  leadingIcon?: string
  disabled?: boolean
  trailingIcon?: string
}
</script>

<script lang="ts" setup>
defineOptions({ inheritAttrs: false })

const props = defineProps<UInputProps>()
const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})

const iconClass = 'text-muted-foreground h-[1em] absolute top-1/2 -translate-y-1/2'

const { forwardRef } = useForwardExpose()
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
      :ref="forwardRef"
      v-model="modelValue"
      :class="cn(inputStyles(), props.leadingIcon && 'ps-7', props.trailingIcon && 'pe-7', $props.classes?.input)"
    />

    <Icon
      v-if="props.trailingIcon"
      :name="props.trailingIcon"
      data-slot="trailingIcon"
      :class="cn(iconClass, 'right-2', classes?.trailingIcon)"
    />
  </Primitive>
</template>
