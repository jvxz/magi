<script lang="ts" setup>
import { injectSpacePageContext } from '~/pages/app/space/[spaceId].vue'

const { spaceId } = injectSpacePageContext()
const joinedRooms = useSpaceJoinedRooms(spaceId)
</script>

<template>
  <UAsideListRoot>
    <UAsideListButton as-child>
      <NuxtLink
        :to="{
          name: 'space-browse',
          params: { spaceId },
        }"
      >
        <UAsideListButtonIcon :icon="ICON__BROWSE" />
        <span>Browse Rooms</span>
      </NuxtLink>
    </UAsideListButton>

    <UAsideListButton as-child>
      <NuxtLink
        :to="{
          name: 'space-members',
          params: { spaceId },
        }"
      >
        <UAsideListButtonIcon :icon="ICON__MEMBERS" />
        <span>Members</span>
      </NuxtLink>
    </UAsideListButton>

    <UAsideListSeparator />

    <template v-if="!isTestMode()">
      <UContextMenuRegionRoot name="spaceAsideRoom">
        <UContextMenuRegionTrigger
          v-for="room in joinedRooms"
          :key="room.roomId"
          :value="{ room }"
          region="spaceAsideRoom"
          as-child
        >
          <UAsideListButton as-child>
            <NuxtLink
              :to="{
                name: 'space-room',
                params: {
                  spaceId,
                  roomId: room.roomId,
                },
              }"
            >
              <UAsideListButtonIcon :icon="ICON__ROOM" />
              <span>{{ room.name }}</span>
            </NuxtLink>
          </UAsideListButton>
        </UContextMenuRegionTrigger>

        <UContextMenuRegionContent v-slot="{ payload }" name="spaceAsideRoom">
          <MenuItemInvite :payload="payload ? { room: payload.room.roomId } : undefined" />
          <MenuItemCopyUrl :id="payload?.room.roomId" type="roomId" />
          <MenuItemCopyId :id="payload?.room.roomId" type="roomId" />

          <UContextMenuSeparator />

          <MenuItemViewAvatar
            :payload="payload ? { type: 'room', label: resolveRoomName(payload.room), room: payload.room } : undefined"
          />
          <MenuItemLeave :id="payload?.room.roomId" type="room" />
        </UContextMenuRegionContent>
      </UContextMenuRegionRoot>
    </template>

    <!-- TEST ONLY BRANCH -->
    <template v-else>
      <UAsideListButton
        v-for="room in [
          createMockRoom({ id: '250', seedMessages: 250 }).room,
          createMockRoom({ id: '500', seedMessages: 500 }).room,
          createMockRoom({ id: '750', seedMessages: 750 }).room,
        ]"
        :key="room.name"
        :data-testid="`mock-room-${room.roomId}`"
        as-child
      >
        <NuxtLink
          :to="{
            name: 'space-room',
            params: {
              spaceId,
              roomId: room.roomId,
            },
          }"
        >
          <UAsideListButtonIcon :icon="ICON__ROOM" />
          <span>{{ room.name }}</span>
        </NuxtLink>
      </UAsideListButton>
    </template>
  </UAsideListRoot>
</template>
