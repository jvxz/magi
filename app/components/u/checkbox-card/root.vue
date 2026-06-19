<script lang="ts" setup>
import type { CheckboxRootEmits, CheckboxRootProps } from 'reka-ui'

import { CheckboxRoot, useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<CheckboxRootProps & { class?: string }>(), { as: 'button' })
const emits = defineEmits<CheckboxRootEmits>()

const delegated = reactiveOmit(props, ['class', 'as'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <CheckboxRoot
    v-bind="forwarded"
    as-child
    :class="
      cn(
        staticBase(),
        buttonVariants({
          variant: 'soft',
        }),
        'p-4 shadow-none bg-surface active:(bg-surface) group size-fit flex justify-between items-start gap-2 flex-row',
        props.class,
      )
    "
  >
    <UCard :as>
      <slot />
    </UCard>
  </CheckboxRoot>
</template>
