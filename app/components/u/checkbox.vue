<script lang="ts" setup>
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<CheckboxRootProps & { class?: string }>()
const emits = defineEmits<CheckboxRootEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CheckboxRoot v-bind="forwarded" :class="cn(checkboxVariants(), $props.class)" data-slot="checkbox">
    <CheckboxIndicator
      data-slot="checkbox-indicator"
      class="text-foreground flex size-full items-center justify-center absolute"
    >
      <Icon name="tabler:check" class="size-4/5" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
