<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-browse',
})

const currentSpaceId = useCurrentSpaceId()
const currentSpace = useCurrentSpace()
const { conversationRooms, isLoading, isSuccess, subspaces, suggestedRooms } = useSpaceHierarchy(currentSpaceId, true)
const rooms = computed(() => [...conversationRooms.value.values()])

const conversationCachedCount = useCachedCount(
  () => `${currentSpaceId.value}-conversations`,
  () => (isSuccess.value ? Math.min(50, conversationRooms.value.size) : undefined),
  6,
)
const subspaceCachedCount = useCachedCount(
  () => `${currentSpaceId.value}-subspaces`,
  () => (isSuccess.value ? Math.min(24, subspaces.value.size) : undefined),
  4,
)

const scrollEl = useTemplateRef<HTMLDivElement>('scrollEl')
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader class="flex gap-2 items-center">
      <Icon :name="ICON__HOME" />
      <span>Home</span>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div ref="scrollEl" class="py-page-y-padding h-full overflow-y-scroll scrollbar-gutter-stable">
    <UShowcaseRoot>
      <PageRoomBrowseHeader :space="currentSpace" :is-loading />

      <UShowcaseSeparator />

      <UContextMenuRegionRoot name="browseRoom">
        <UShowcaseContent>
          <!-- conversations -->
          <PageRoomBrowseSection title="Rooms" :default-open="true" class="h-fit">
            <VirtualList
              v-if="!isLoading"
              v-slot="{ item: room, index }"
              :items="rooms"
              :scroll-el="scrollEl"
              :estimate-size="(_, i) => (i ? 73 : 72)"
              :get-item-key="room => room.room_id"
            >
              <UCardGroupSeparator v-if="index" />
              <PageRoomBrowseCard :room :suggested="suggestedRooms.has(room.room_id)" />
            </VirtualList>

            <!-- conversation skeletons -->
            <div v-else>
              <template v-for="i in conversationCachedCount" :key="i">
                <UCardGroupSeparator v-if="i - 1" />

                <UCardGroupItem variant="raised" class="h-18">
                  <USkeleton class="rounded-sm size-full" />
                </UCardGroupItem>
              </template>
            </div>
          </PageRoomBrowseSection>

          <!-- subspaces -->
          <template v-if="!isLoading">
            <PageRoomBrowseSection
              v-for="space in subspaces.values()"
              :key="space.room_id"
              v-slot="{ open }"
              :title="space.name ?? space.room_id"
              :avatar="space.avatar_url"
              :description="space.topic"
              :room-count="space.roomCount"
              :member-count="space.num_joined_members"
              avatar-placeholder
            >
              <PageRoomBrowseSubspace :space="space" :open :count="space.roomCount" :scroll-el="scrollEl" />
            </PageRoomBrowseSection>
          </template>

          <!-- subspace skeletons -->
          <template v-else>
            <UCardGroupItem v-for="key in subspaceCachedCount" :key class="h-12">
              <USkeleton class="size-full" />
            </UCardGroupItem>
          </template>
        </UShowcaseContent>

        <PageRoomBrowseContextMenuContent />
      </UContextMenuRegionRoot>
    </UShowcaseRoot>
  </div>
</template>
