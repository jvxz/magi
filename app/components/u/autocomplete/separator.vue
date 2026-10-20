<script setup lang="ts">
import type { ComboboxSeparatorProps } from 'reka-ui'

import { AutocompleteSeparator } from 'reka-ui'

export type UAutocompleteSeparatorProps = ComboboxSeparatorProps & { class?: HTMLAttributes['class'] }

const props = defineProps<UAutocompleteSeparatorProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <AutocompleteSeparator
    data-slot="autocomplete-separator"
    v-bind="delegated"
    :class="cn('-mx-1 my-1 h-px bg-border', props.class)"
  >
    <slot />
  </AutocompleteSeparator>
</template>
