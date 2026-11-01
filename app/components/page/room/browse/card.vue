<script lang="ts" setup>
import type { HierarchyRoom } from 'matrix-js-sdk'
import type { PrimitiveProps } from 'reka-ui'

const { room, spaceId } = defineProps<
  PrimitiveProps & {
    room: HierarchyRoom
    spaceId: string
    suggested?: boolean
  }
>()

const joined = useRoomIsJoined(() => room.room_id)

const roomActions = useRoomActions(() => room.room_id)
const { mutate: join } = roomActions.join
const isJoining = useIsKeyMutating('joinRoom', () => room.room_id)

const { openDialog } = useGlobalDialog()
</script>

<template>
  <UContextMenuRegionTrigger as-child region="browseRoom" :value="{ room }">
    <URoomShowcaseCardRoot class="group border-0 flex gap-2 h-fit shadow-none items-center" :room="room.room_id" group>
      <URoomShowcaseCardImage
        as-child
        :dialog="room.avatar_url ? { type: 'image', url: room.avatar_url, alt: room.name ?? room.room_id } : undefined"
      >
        <MatrixAvatar square :src="room.avatar_url" :alt="room.name ?? room.room_id" />
      </URoomShowcaseCardImage>

      <URoomShowcaseCardContent>
        <URoomShowcaseCardHeader class="shrink">
          <URoomShowcaseCardTitle class="flex gap-2 max-h-1em items-center">
            <span class="truncate">{{ room.name ?? room.room_id }}</span>

            <UBadge v-if="suggested" size="sm" class="shrink-0"> Suggested </UBadge>
          </URoomShowcaseCardTitle>

          <URoomShowcaseCardDescription class="flex gap-1 items-center">
            <span class="shrink-0"> {{ room.num_joined_members }} members </span>

            <template v-if="room.topic">
              <UInlineSeparatorRoot class="shrink-0" />

              <UButton
                variant="ghost-inline"
                class="text-xs rounded-none shrink w-full"
                @click="openDialog('text', { title: 'Topic', text: room.topic })"
              >
                <span class="truncate">{{ room.topic }}</span>
              </UButton>
            </template>
          </URoomShowcaseCardDescription>
        </URoomShowcaseCardHeader>

        <div class="flex shrink-0 gap-1 items-center justify-center">
          <!-- join btn -->
          <UButton v-if="!joined" :is-loading="isJoining" variant="ghost-raised" @click="join()">
            <span>Join</span>
          </UButton>

          <UTooltipRegionRoot name="lobbyRoomCard">
            <UTooltipRegionTrigger v-if="joined" as-child region="lobbyRoomCard" value="Go to room">
              <UButton as-child size="icon" variant="ghost-raised">
                <NuxtLink :to="{ name: 'space-room', params: { spaceId, roomId: room.room_id } }">
                  <Icon :name="ICON__GO" />
                </NuxtLink>
              </UButton>
            </UTooltipRegionTrigger>

            <UDropdownMenuRoot>
              <UTooltipRegionTrigger as-child region="lobbyRoomCard" value="More options">
                <UDropdownMenuTrigger as-child>
                  <UButton size="icon" variant="ghost-raised">
                    <Icon :name="ICON__MORE" />
                  </UButton>
                </UDropdownMenuTrigger>
              </UTooltipRegionTrigger>

              <UDropdownMenuContent>
                <PageRoomBrowseCardMenuItems :room type="room" />
              </UDropdownMenuContent>
            </UDropdownMenuRoot>

            <UTooltipRegionContent v-slot="{ payload }" name="lobbyRoomCard">
              {{ payload }}
            </UTooltipRegionContent>
          </UTooltipRegionRoot>
        </div>
      </URoomShowcaseCardContent>
    </URoomShowcaseCardRoot>
  </UContextMenuRegionTrigger>
</template>
