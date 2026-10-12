<script lang="ts" setup>
import type { UCardGroupItemHeaderProps } from '../card-group/item-header.vue'

const props = defineProps<UCardGroupItemHeaderProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemHeader
    v-bind="delegated"
    :class="cn('flex flex-col shrink-0 justify-around tabular-nums', props.class)"
  >
    <slot />
  </UCardGroupItemHeader>
</template>
