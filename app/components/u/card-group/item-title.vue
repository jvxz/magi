<script lang="ts" setup>
import type { UCardTitleProps } from '../card/title.vue'

export interface UCardGroupItemTitleProps extends UCardTitleProps {}

const props = defineProps<UCardGroupItemTitleProps>()
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardTitle
    v-bind="delegated"
    :class="cn('text-base font-medium truncate text-sm', props.class)"
    data-slot="card-group-item-title"
  >
    <slot />
  </UCardTitle>
</template>
