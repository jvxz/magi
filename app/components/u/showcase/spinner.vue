<script lang="ts" setup>
const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <USpinner :class="cn('size-6', props.class)" />
</template>
