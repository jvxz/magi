<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui'

import { AutocompleteContent, useForwardPropsEmits } from 'reka-ui'

export type UAutocompleteListProps = ComboboxContentProps & { class?: HTMLAttributes['class'] }
export type UAutocompleteListEmits = ComboboxContentEmits

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UAutocompleteListProps>(), {
  sideOffset: 6,
})
const emits = defineEmits<UAutocompleteListEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AutocompleteContent
    data-slot="autocomplete-list"
    v-bind="{ ...$attrs, ...forwarded }"
    :class="
      cn(
        popoverContentBase(),
        'absolute top-(--reka-autocomplete-trigger-height) mt-1 w-full overflow-hidden',
        props.class,
      )
    "
  >
    <slot />
  </AutocompleteContent>
  <!-- <AutocompletePortal class="relative">
    <AutocompleteContent
      data-slot="autocomplete-list"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="cn(popoverContentBase(), 'absolute w-full overflow-hidden top-0', props.class)"
    >
      <slot />
    </AutocompleteContent>
  </AutocompletePortal> -->
</template>
