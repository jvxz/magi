<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { InputTypeHTMLAttribute } from 'vue'

import { useForwardExpose } from 'reka-ui'

export interface UInputRef extends ComponentPublicInstance {
  $el: HTMLInputElement | undefined
}

export type UInputProps = PrimitiveProps & {
  defaultValue?: string | number
  modelValue?: string | number
  class?: HTMLAttributes['class']
  ui?: DefineClasses<'root' | 'input' | 'leadingIcon' | 'trailingIcon'>
  leadingIcon?: string
  disabled?: boolean
  variant?: InputVariants['variant']
  trailingIcon?: string
  type?: InputTypeHTMLAttribute
  disablePw?: boolean
}
</script>

<script lang="ts" setup>
export interface UInputEmits {
  (e: 'update:modelValue', payload: string | number): void
}

defineOptions({ inheritAttrs: false })

const props = defineProps<UInputProps>()

const emits = defineEmits<UInputEmits>()

const modelValue = useVModel(props, 'modelValue', emits, {
  defaultValue: props.defaultValue,
  passive: true,
})

const iconClass = 'text-muted-foreground h-[1em] absolute top-1/2 -translate-y-1/2'

const { forwardRef } = useForwardExpose()
</script>

<template>
  <Primitive v-bind="{ as, asChild }" :class="cn('relative', props.class, props.ui?.root)">
    <Icon
      v-if="props.leadingIcon"
      :name="props.leadingIcon"
      data-slot="leadingIcon"
      :class="cn(iconClass, 'left-2', ui?.leadingIcon)"
    />

    <input
      v-bind="$attrs"
      :ref="forwardRef"
      v-model="modelValue"
      v-disable-pw="disablePw"
      :type="props.type"
      :class="cn(inputStyles({ variant }), props.leadingIcon && 'ps-7', props.trailingIcon && 'pe-7', props.ui?.input)"
    />

    <Icon
      v-if="props.trailingIcon"
      :name="props.trailingIcon"
      data-slot="trailingIcon"
      :class="cn(iconClass, 'right-2', ui?.trailingIcon)"
    />
  </Primitive>
</template>
