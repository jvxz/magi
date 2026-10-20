<script lang="ts" setup>
export interface UShowcaseSpinnerProps {
  class?: HTMLAttributes['class']
}

const props = defineProps<UShowcaseSpinnerProps>()
</script>

<template>
  <USpinner :class="cn('size-6', props.class)" />
</template>
