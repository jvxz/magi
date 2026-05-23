<script lang="ts" setup>
const props = defineProps<{
  room: MaybeRoomOrId | undefined
  user: MaybeUserOrId | undefined
}>()

const roomMember = useRoomMember(
  () => props.room,
  () => props.user,
)
</script>

<template>
  <slot :room-member />
</template>
