<script lang="ts" setup>
import type { Room } from 'matrix-js-sdk'

const { inviteRoom } = defineProps<{
  inviteRoom: Room
}>()

const isDirectInvite = useIsDirectInvite(inviteRoom)
const { self } = useSelf()
const inviterId = computed(() => getInviter(inviteRoom, self.value?.userId))
const inviter = useUserProfile(inviterId)

const { accept, decline } = useRoomInviteActions(inviteRoom)
const { isPending: isAccepting, reset: resetJoin } = accept
const { isPending: isDeclining, reset: resetDecline } = decline

async function handleDecline() {
  resetJoin()
  decline.mutate()
}

const navEpoch = useNavEpoch()
async function handleJoin() {
  const beforeNavEpoch = navEpoch.value
  resetDecline()

  const room = await accept.mutateAsync()
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
    <URoomShowcaseCardRoot :key="inviteRoom.roomId" always-show-avatar :room="inviteRoom">
      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader>
          <URoomShowcaseCardTitle class="shrink-0 gap-1">
            <span>{{ resolveRoomName(inviteRoom) }}</span>
            <UTooltipIcon v-if="isDirectInvite" name="direct" class="text-muted-foreground size-3.5" />
            <UTooltipIcon v-if="isEncrypted(inviteRoom)" name="encrypted" class="text-muted-foreground size-3.5" />
            <!-- <UBadge v-if="isDirectInvite" size="sm"> Direct Room </UBadge> -->
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription>
            Invited by
            <span class="font-medium">{{ inviter?.displayname }} ({{ inviterId }})</span>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>

        <div class="flex flex-1 h-full items-start justify-end">
          <div class="flex gap-2 items-center">
            <UButton
              :disabled="isAccepting"
              :is-loading="isDeclining"
              size="sm"
              variant="soft"
              @click="handleDecline()"
            >
              <span>Decline</span>
            </UButton>
            <UButton
              :is-loading="isAccepting"
              :disabled="isDeclining"
              size="sm"
              variant="default"
              @click="handleJoin()"
            >
              <span>Accept</span>
            </UButton>
          </div>
        </div>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot>
  </UContextMenuRegionTrigger>
</template>
