<script lang="ts" setup>
import type { UCardGroupItemImageProps } from '../card-group/item-image.vue'

export interface URoomShowcaseCardImageProps extends UCardGroupItemImageProps {}

const props = defineProps<URoomShowcaseCardImageProps>()

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemImage v-bind="delegated" :class="props.class" data-slot="room-showcase-card-image">
    <slot />
  </UCardGroupItemImage>
</template>
