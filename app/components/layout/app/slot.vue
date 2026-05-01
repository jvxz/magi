<script lang="ts" setup>
// component to allow for type-safe, teleport-based slots for nuxt layouts. each
// teleport corresponds to a wrapper div in the `app` layout, where the slot is
// what is rendered inside the wrapper div in the layout. this helps with keeping
// components persistent & prevents re-renders by using `definePageMeta` to define
// the layout for the page instead of `NuxtLayout` wrapping the page

const props = defineProps<{
  name: AppLayoutSlotName
}>()

const to = computed(() => `#app-${props.name}`)

const isAlive = useAlive()
</script>

<template>
  <Teleport
    v-if="isAlive"
    defer
    :to
  >
    <slot />
  </Teleport>
</template>
