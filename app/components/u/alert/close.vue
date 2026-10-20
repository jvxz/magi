<script lang="ts" setup>
import { useForwardProps } from 'reka-ui'

import type { UButtonProps } from '../button.vue'

export interface UAlertCloseProps extends UButtonProps {}

const props = withDefaults(defineProps<UAlertCloseProps>(), {
  as: 'button',
})

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <UButton
    v-bind="forwarded"
    size="icon"
    aria-label="Close"
    variant="ghost"
    class="rounded-sm size-6 right-4 top-4 absolute"
  >
    <Icon :name="ICON__CLOSE" />
  </UButton>
</template>
