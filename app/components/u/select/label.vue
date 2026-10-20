<script setup lang="ts">
import type { SelectLabelProps } from 'reka-ui'

export type USelectLabelProps = SelectLabelProps & { class?: HTMLAttributes['class'] }

const props = defineProps<USelectLabelProps>()
</script>

<template>
  <SelectLabel data-slot="select-label" :class="cn('px-2 py-1.5 text-sm font-medium', props.class)">
    <slot />
  </SelectLabel>
</template>
