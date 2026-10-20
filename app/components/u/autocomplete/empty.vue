<script setup lang="ts">
import type { ComboboxEmptyProps } from 'reka-ui'

import { AutocompleteEmpty } from 'reka-ui'

export type UAutocompleteEmptyProps = ComboboxEmptyProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAutocompleteEmptyProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AutocompleteEmpty
    data-slot="autocomplete-empty"
    v-bind="delegated"
    :class="cn('py-6 text-center text-sm text-muted-foreground', props.class)"
  >
    <slot />
  </AutocompleteEmpty>
</template>
