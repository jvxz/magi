<script setup lang="ts">
import type { ComboboxCancelProps } from 'reka-ui'

import { AutocompleteCancel, useForwardProps } from 'reka-ui'

export type UAutocompleteCancelProps = ComboboxCancelProps & {
  class?: HTMLAttributes['class']
  size?: 'sm' | 'default'
}

const props = withDefaults(defineProps<UAutocompleteCancelProps>(), { size: 'default' })

const delegated = reactiveOmit(props, 'class', 'size')
const forwarded = useForwardProps(delegated)
</script>

<template>
  <AutocompleteCancel
    data-slot="autocomplete-cancel"
    :data-size="size"
    v-bind="forwarded"
    :class="cn(interactiveBase({ size: 'icon' }), props.class)"
  >
    <slot>
      <Icon :name="ICON__CLOSE" class="text-muted-foreground size-3.5" />
    </slot>
  </AutocompleteCancel>
</template>
