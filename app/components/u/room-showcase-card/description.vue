<script lang="ts" setup>
import type { UCardGroupItemDescriptionProps } from '../card-group/item-description.vue'

const props = withDefaults(defineProps<UCardGroupItemDescriptionProps>(), { as: 'p' })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <UCardGroupItemDescription v-bind="delegated" :class="cn('text-xs text-muted-foreground truncate', props.class)">
    <slot />
  </UCardGroupItemDescription>
</template>
