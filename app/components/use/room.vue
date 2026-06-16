<script lang="ts" setup>
const props = defineProps<{
  room: MaybeRoomOrId | undefined
}>()

const room = useRoom(() => props.room)
</script>

<template>
  <slot :room />
</template>
