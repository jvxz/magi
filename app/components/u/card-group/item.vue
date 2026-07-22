<script lang="ts" setup>
import type { UCardProps } from '../card/index.vue'

export interface CardGroupItemProps extends UCardProps {}

const props = defineProps<CardGroupItemProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCard
    v-bind="delegated"
    :class="cn('rounded-none border-0 p-0 shadow-none', props.class)"
    data-slot="card-group-item"
  >
    <slot />
  </UCard>
</template>
