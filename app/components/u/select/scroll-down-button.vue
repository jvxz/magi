<script setup lang="ts">
import type { SelectScrollDownButtonProps } from 'reka-ui'

import { useForwardProps } from 'reka-ui'

const props = defineProps<SelectScrollDownButtonProps & { class?: HTMLAttributes['class'] }>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <SelectScrollDownButton
    data-slot="select-scroll-down-button"
    v-bind="forwarded"
    :class="cn('flex cursor-default items-center justify-center py-1', props.class)"
  >
    <slot>
      <Icon :name="ICON__CHEVRON_DOWN" class="size-4!" />
    </slot>
  </SelectScrollDownButton>
</template>
