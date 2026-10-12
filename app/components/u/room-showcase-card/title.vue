<script lang="ts" setup>
import type { UCardGroupItemTitleProps } from '../card-group/item-title.vue'

const props = withDefaults(defineProps<UCardGroupItemTitleProps>(), { as: 'p' })
const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemTitle v-bind="delegated" :class="cn('flex gap-2 max-h-1em items-center', props.class)">
    <slot />
  </UCardGroupItemTitle>
</template>
