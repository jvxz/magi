<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const { inviteRoom } = defineProps<{
  inviteRoom: Room
}>()

const isDirectInvite = useIsDirectInvite(inviteRoom)
const { self } = useSelf()
const inviterId = computed(() => getInviter(inviteRoom, self.value?.userId))
const inviter = useUserProfile(inviterId)

const { join, leave: decline } = useRoomActions(inviteRoom)
const { reset: resetJoin } = join
const { reset: resetDecline } = decline

const isJoining = useIsKeyMutating('joinRoom', () => inviteRoom.roomId)
const isDeclining = useIsKeyMutating('leaveRoom', () => inviteRoom.roomId)

async function handleDecline() {
  resetJoin()
  decline.mutate()
}

const navEpoch = useNavEpoch()
async function handleJoin() {
  const beforeNavEpoch = navEpoch.value
  resetDecline()

  const room = await join.mutateAsync()
  if (!room || navEpoch.value !== beforeNavEpoch) return

  return navigateTo(
    isSpace(room)
      ? {
          name: 'space',
          params: { spaceId: room.roomId },
        }
      : {
          name: 'direct-room',
          params: {
            directRoomId: room.roomId,
          },
        },
  )
}
</script>

<template>
  <UContextMenuRegionTrigger as-child region="invite" :value="{ roomId: inviteRoom.roomId }">
    <URoomShowcaseCardRoot always-show-avatar :key="inviteRoom.roomId" :room="inviteRoom">
      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader>
          <URoomShowcaseCardTitle class="shrink-0 gap-1">
            <span>{{ resolveRoomName(inviteRoom) }}</span>
            <UTooltipIcon name="direct" v-if="isDirectInvite" class="text-muted-foreground size-3.5" />
            <UTooltipIcon name="encrypted" v-if="isEncrypted(inviteRoom)" class="text-muted-foreground size-3.5" />
            <!-- <UBadge v-if="isDirectInvite" size="sm"> Direct Room </UBadge> -->
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            Invited by
            <span class="font-medium">{{ inviter?.displayname }} ({{ inviterId }})</span>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>

        <div class="flex flex-1 h-full justify-end items-start">
          <div class="flex items-center gap-2">
            <UButton @click="handleDecline()" :disabled="isJoining" :is-loading="isDeclining" size="sm" variant="soft">
              <span>Decline</span>
            </UButton>
            <UButton @click="handleJoin()" :is-loading="isJoining" :disabled="isDeclining" size="sm" variant="default">
              <span>Accept</span>
            </UButton>
          </div>
        </div>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot>
  </UContextMenuRegionTrigger>
</template>
