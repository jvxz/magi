<script setup lang="ts">
import type { ComboboxItemIndicatorProps } from 'reka-ui'

import { AutocompleteItemIndicator, useForwardProps } from 'reka-ui'

export type UAutocompleteItemIndicatorProps = ComboboxItemIndicatorProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAutocompleteItemIndicatorProps>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardProps(delegated)
</script>

<template>
  <AutocompleteItemIndicator
    data-slot="autocomplete-item-indicator"
    v-bind="forwarded"
    :class="cn('ml-auto', props.class)"
  >
    <slot>
      <Icon :name="ICON__CHECK" class="size-3!" />
    </slot>
  </AutocompleteItemIndicator>
</template>
