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
const { isPending: isJoining, error: joinError, reset: resetJoin } = join
const { isPending: isDeclining, error: declineError, reset: resetDecline } = decline

const { client } = useMatrixClient()

async function handleDecline() {
  resetJoin()
  decline.mutate()
}

async function handleJoin() {
  resetDecline()

  const room = await join.mutateAsync()
  // if (!room) return

  // return navigateTo(
  //   isDirectInvite.value
  //     ? {
  //         name: 'direct-room',
  //         params: {
  //           directRoomId: room.roomId,
  //         },
  //       }
  //     : {
  //         name: 'space-room',
  //         params: { roomId: room.roomId },
  //       },
  // )
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

            <!-- <span>
              {{ $n(inviteRoom.getJoinedMemberCount()) }}
              {{ handlePlural(inviteRoom.getJoinedMemberCount(), 'members', 'member') }}
            </span> -->
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>

        <div class="flex flex-1 h-full justify-end items-start">
          <div class="flex items-center gap-2">
            <!-- <p class="text-sm text-danger truncate" v-if="joinError || declineError">
              {{ joinError ?? declineError }}
            </p> -->
            <!-- <UErrorText :error="[joinError, declineError]" /> -->
            <!-- <p class="text-sm text-clip">
              Invited by <span class="font-medium">{{ inviter?.displayname }}</span>
            </p> -->

            <!-- <div class="font-medium flex gap-1 items-center"></div> -->

            <!-- <div class="text-sm"></div> -->
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
