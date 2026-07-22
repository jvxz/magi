<script lang="ts" setup>
import type { USeparatorProps } from '../separator.vue'

export interface CardGroupSeparatorProps extends USeparatorProps {}

const props = defineProps<CardGroupSeparatorProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <USeparator v-bind="delegated" :class="cn('', props.class)" data-slot="card-group-separator">
    <slot />
  </USeparator>
</template>
