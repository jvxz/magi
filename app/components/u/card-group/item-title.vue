<script lang="ts" setup>
import type { UCardTitleProps } from '../card/title.vue'

export interface CardGroupItemTitleProps extends UCardTitleProps {}

const props = defineProps<CardGroupItemTitleProps>()
</script>

<template>
  <UCardTitle v-bind="props" data-slot="card-group-item-title">
    <slot />
  </UCardTitle>
</template>
