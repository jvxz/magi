<script setup lang="ts">
import type { ComboboxItemEmits, ComboboxItemProps } from 'reka-ui'

import { AutocompleteItem, useForwardPropsEmits } from 'reka-ui'

import { cn } from '#imports'

export type UAutocompleteItemProps = ComboboxItemProps & { class?: HTMLAttributes['class'] }
export type UAutocompleteItemEmits = ComboboxItemEmits

const props = defineProps<UAutocompleteItemProps>()
const emits = defineEmits<UAutocompleteItemEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AutocompleteItem
    data-slot="autocomplete-item"
    v-bind="forwarded"
    :class="cn(popoverItemBase(), 'w-full gap-2 data-[highlighted]:bg-secondary', props.class)"
  >
    <slot />
  </AutocompleteItem>
</template>
