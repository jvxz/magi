<script setup lang="ts">
import type { AutocompleteRootEmits, AutocompleteRootProps } from 'reka-ui'

import { AutocompleteRoot, useForwardPropsEmits } from 'reka-ui'

export type UAutocompleteRootProps = AutocompleteRootProps
export type UAutocompleteRootEmits = AutocompleteRootEmits

const props = defineProps<UAutocompleteRootProps>()
const emits = defineEmits<UAutocompleteRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <AutocompleteRoot v-slot="slotProps" data-slot="autocomplete" v-bind="forwarded" class="relative">
    <slot v-bind="slotProps" />
  </AutocompleteRoot>
</template>
