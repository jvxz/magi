<script lang="ts" setup>
const props = withDefaults(defineProps<{ withMembersList?: boolean; room: MaybeRoomOrId | undefined }>(), {
  withMembersList: true,
})

const room = useRoom(() => props.room)
</script>

<template>
  <div v-if="room" class="flex flex-1 size-full">
    <div class="flex flex-col size-full relative">
      <RoomEventList :room />
      <RoomInput />
    </div>

    <RoomMembersList v-if="withMembersList" />
    <RoomEventReactionsViewer />
  </div>
</template>
