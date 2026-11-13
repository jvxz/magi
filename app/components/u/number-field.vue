<script lang="ts" setup>
import type { NumberFieldRootEmits, NumberFieldRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export interface UNumberFieldRootProps extends NumberFieldRootProps {
  class?: HTMLAttributes['class']
  variant?: InputVariants['variant']
  allowEmpty?: boolean
}
export interface UNumberFieldRootEmits extends NumberFieldRootEmits {}

const props = withDefaults(defineProps<UNumberFieldRootProps>(), { invertWheelChange: true })
const emits = defineEmits<UNumberFieldRootEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)

const buttonClass = computed(() =>
  cn(
    interactiveBase({
      size: 'icon-xs',
      variant: props.variant === 'raised' || props.variant === 'top' ? 'ghost-raised' : 'ghost',
    }),
    'rounded-sm flex items-center justify-center shrink-0',
  ),
)

const beforeUpdate: (...args: UNumberFieldRootEmits['beforeUpdate:modelValue']) => void = (val, details) => {
  if (val == null && !props.allowEmpty) details.cancel()
  else emits('beforeUpdate:modelValue', val, details)
}
</script>

<template>
  <NumberFieldRoot
    v-bind="forwarded"
    :class="cn(inputStyles({ variant }), 'px-1 flex items-center gap-1 cursor-default', props.class)"
    data-slot="number-field"
    @before-update:model-value="beforeUpdate"
  >
    <div class="flex-1 shrink-1 size-fit">
      <NumberFieldIncrement :class="buttonClass">
        <Icon :name="ICON__INCREMENT" />
      </NumberFieldIncrement>
    </div>

    <NumberFieldInput class="text-sm font-medium mx-6 text-center outline-none w-full tabular-nums" />

    <div class="flex-1 shrink-1 size-fit justify-self-end">
      <NumberFieldDecrement :class="cn(buttonClass, 'justify-self-end')">
        <Icon :name="ICON__DECREMENT" />
      </NumberFieldDecrement>
    </div>
  </NumberFieldRoot>
</template>
