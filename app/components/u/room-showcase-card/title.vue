<script lang="ts" setup>
import type { UCardGroupItemTitleProps } from '../card-group/item-title.vue'

export type URoomShowcaseCardTitleProps = UCardGroupItemTitleProps

const props = withDefaults(defineProps<URoomShowcaseCardTitleProps>(), { as: 'p' })
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemTitle v-bind="delegated" :class="cn('flex gap-2 max-h-1em items-center', props.class)">
    <slot />
  </UCardGroupItemTitle>
</template>
