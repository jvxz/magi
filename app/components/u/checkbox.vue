<script lang="ts">
import { buttonVariants } from './button.vue'

export const checkboxVariants = tv({
  base: [buttonVariants(), 'size-4 aspect-square p-0 rounded-sm'],
  defaultVariants: {
    variant: 'soft',
  },
})
</script>

<script lang="ts" setup>
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UCheckboxProps = CheckboxRootProps & { class?: HTMLAttributes['class'] }
export type UCheckboxEmits = CheckboxRootEmits

const props = defineProps<UCheckboxProps>()
const emits = defineEmits<UCheckboxEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CheckboxRoot v-bind="forwarded" :class="cn(checkboxVariants(), props.class)" data-slot="checkbox">
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="text-foreground flex size-full items-center justify-center absolute"
    >
      <Icon :name="ICON__CHECK" class="size-4/5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
