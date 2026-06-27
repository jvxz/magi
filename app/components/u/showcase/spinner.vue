<script lang="ts" setup>
const props = defineProps<{ class?: string }>()
</script>

<template>
  <USpinner :class="cn('size-6', props.class)" />
</template>
