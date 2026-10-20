<script setup lang="ts">
import type { ComboboxContentEmits, ComboboxContentProps } from 'reka-ui'

import { AutocompleteContent, AutocompletePortal, useForwardPropsEmits } from 'reka-ui'

export type UAutocompleteContentProps = ComboboxContentProps & { class?: HTMLAttributes['class'] }
export type UAutocompleteContentEmits = ComboboxContentEmits

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<UAutocompleteContentProps>(), {
  position: 'popper',
  sideOffset: 6,
})
const emits = defineEmits<UAutocompleteContentEmits>()

const delegated = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <AutocompletePortal>
    <AutocompleteContent
      data-slot="autocomplete-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          popoverContentBase(),
          'z-10 w-[var(--reka-combobox-trigger-width)] overflow-hidden will-change-[opacity,transform] data-[state=closed]:animate-none data-[state=open]:animate-none',
          props.class,
        )
      "
    >
      <slot />
    </AutocompleteContent>
  </AutocompletePortal>
</template>
