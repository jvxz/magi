<script lang="ts" setup>
const leaveDialogOpen = shallowRef(false)
const inviteDialogOpen = shallowRef(false)

const targetRoomId = shallowRef<string>()
const targetRoom = useRoom(targetRoomId)

const { removeRoomFromDirectList } = useDirectRooms()
const { leave } = useRoomActions(targetRoomId)
const { execute: leaveRoom, pending: isRemoving } = useAsyncData(async () => {
  if (!targetRoomId.value) return

  await leave.mutateAsync()
  await removeRoomFromDirectList(targetRoomId.value)

  leaveDialogOpen.value = false

  return navigateTo({
    name: 'me-home',
  })
})
</script>

<template>
  <UAlertDialogRoot
    :open="leaveDialogOpen"
    @update:open="
      e => {
        if (!isRemoving) leaveDialogOpen = e
      }
    "
  >
    <UAlertDialogContent>
      <UAlertDialogHeader>
        <UAlertDialogTitle> Are you sure? </UAlertDialogTitle>
        <UAlertDialogDescription> You will need an invite to join this room again. </UAlertDialogDescription>
      </UAlertDialogHeader>

      <UAlertDialogFooter>
        <UAlertDialogCancel> Cancel </UAlertDialogCancel>
        <UButton :is-loading="isRemoving" @click="leaveRoom"> <span>Leave</span> </UButton>
      </UAlertDialogFooter>
    </UAlertDialogContent>
  </UAlertDialogRoot>

  <DialogInvite v-model:open="inviteDialogOpen" :room="targetRoom" />

  <UContextMenuRegionContent v-slot="{ payload }" name="directRoom">
    <UContextMenuItem
      @select="
        () => {
          targetRoomId = payload?.roomId
          leaveDialogOpen = true
        }
      "
    >
      Leave room
    </UContextMenuItem>
    <UContextMenuItem
      @select="
        () => {
          targetRoomId = payload?.roomId
          inviteDialogOpen = true
        }
      "
    >
      Invite
    </UContextMenuItem>
  </UContextMenuRegionContent>
</template>
