<script setup lang="ts">
import type { SelectScrollUpButtonProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

export type USelectScrollUpButtonProps = SelectScrollUpButtonProps & { class?: HTMLAttributes['class'] }

const props = defineProps<USelectScrollUpButtonProps>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <SelectScrollUpButton
    data-slot="select-scroll-up-button"
    v-bind="forwarded"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <Icon :name="ICON__CHEVRON_UP" class="size-4!" />
    </slot>
  </SelectScrollUpButton>
</template>
