<script lang="ts">
export interface SpacePageContext {
  spaceId: ComputedRef<string>
}

export const [injectSpacePageContext, provideSpacePageContext] = createContext<SpacePageContext>('SpacePage')
</script>

<script lang="ts" setup>
definePageMeta({
  key: 'space',
  layout: 'app',
  middleware: ['space'],
  name: 'space',
})

const route = useRoute()
const spaceId = computed(() => route.params.spaceId)
const spaceName = useRoomComputed(spaceId, space => (space ? resolveRoomName(space) : undefined))

defineAppLabel({ label: spaceName })

const currentRoomId = useCurrentRoomId()
const room = useRoom(currentRoomId)

const isPaginating = shallowRef(false)

provideSpacePageContext({
  spaceId,
})
</script>

<template>
  <LayoutAppSlot name="aside-header">
    <LayoutAppAsideHeaderTitle class="pe-2.5 justify-between">
      <span>{{ spaceName }}</span>

      <PageSpaceAsideHeaderDropdown />
    </LayoutAppAsideHeaderTitle>
  </LayoutAppSlot>

  <LayoutAppSlot name="aside">
    <PageSpaceAside />
  </LayoutAppSlot>

  <RoomInstance v-if="room" :room />
  <RoomPreview v-else-if="currentRoomId" :room-id="currentRoomId" />

  <NuxtPage :is-paginating />
</template>
