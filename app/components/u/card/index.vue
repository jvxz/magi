<script lang="ts" setup>
const props = withDefaults(defineProps<{
  class?: string
  variant?: keyof typeof staticStyles.variant
}>(), {
  variant: 'default',
})
</script>

<template>
  <div
    data-slot="card"
    :class="cn(
      staticStyles.base,
      staticStyles.variant[variant],
      'flex flex-col gap-5 shadow-lg',
      props.class,
    )"
  >
    <slot />
  </div>
</template>
