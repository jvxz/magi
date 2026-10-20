<script setup lang="ts">
import type { ComboboxGroupProps } from 'reka-ui'

import { AutocompleteGroup, AutocompleteLabel } from 'reka-ui'

export type UAutocompleteGroupProps = ComboboxGroupProps & {
  class?: HTMLAttributes['class']
  heading?: string
}

const props = defineProps<UAutocompleteGroupProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AutocompleteGroup
    data-slot="autocomplete-group"
    v-bind="delegated"
    :class="cn('overflow-hidden text-foreground', props.class)"
  >
    <AutocompleteLabel v-if="heading" class="text-xs text-muted-foreground font-medium px-2 py-1.5">
      {{ heading }}
    </AutocompleteLabel>
    <slot />
  </AutocompleteGroup>
</template>
