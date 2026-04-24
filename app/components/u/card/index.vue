<script lang="ts" setup>
const props = defineProps<{
  class?: string
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="cn(
      staticStyles.base,
      staticStyles.variant.default,
      'flex flex-col gap-5 shadow-lg',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
