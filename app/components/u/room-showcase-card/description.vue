<script lang="ts" setup>
import type { UCardGroupItemDescriptionProps } from '../card-group/item-description.vue'

export type URoomShowcaseCardDescriptionProps = UCardGroupItemDescriptionProps

const props = withDefaults(defineProps<URoomShowcaseCardDescriptionProps>(), { as: 'p' })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemDescription v-bind="delegated" :class="cn('text-xs text-muted-foreground truncate', props.class)">
    <slot />
  </UCardGroupItemDescription>
</template>
