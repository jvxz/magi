<script lang="ts" setup>
import type { ButtonProps } from '~/components/u/button.vue'

defineProps<ButtonProps>()
</script>

<template>
  <UButton v-bind="$props" variant="ghost" :class="cn('text-sm h-9 w-full justify-start w-full', $props.class)">
    <slot />
  </UButton>
</template>
