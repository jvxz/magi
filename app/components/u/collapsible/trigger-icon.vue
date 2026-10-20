<script lang="ts" setup>
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Icon :name="ICON__CHEVRON_DOWN" :class="cn('shrink-0 size-4 group-data-[state=open]:rotate-180', props.class)" />
</template>
