<script lang="ts" setup>
export interface UCollapsibleTriggerIconProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UCollapsibleTriggerIconProps>()
</script>

<template>
  <Icon :name="ICON__CHEVRON_DOWN" :class="cn('shrink-0 size-4 group-data-[state=open]:rotate-180', props.class)" />
</template>
