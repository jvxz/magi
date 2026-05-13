<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'space-browse',
})

const currentSpace = useCurrentSpace()
const { isLoading, orphanedRooms, subspaces, suggestedRooms } = useSpaceHierarchy(
  () => currentSpace.value?.roomId,
  true,
)

const scrollEl = useTemplateRef('scrollEl')
provideIntersectionObserver(scrollEl)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader class="px-3.5 flex gap-2 items-center">
      <Icon name="tabler:home" />
      <p class="text-sm font-medium">Home</p>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div ref="scrollEl" class="py-page-y-padding h-full overflow-y-scroll scrollbar-gutter-stable">
    <div class="mx-auto max-w-generic-page-max-width">
      <PageRoomBrowseHeader :space="currentSpace" :is-loading />

      <div class="grid h-12 w-full place-items-center -mb-2">
        <USeparator class="w-full" />
      </div>

      <div class="flex flex-col gap-2 *:w-full">
        <PageRoomBrowseSection title="Rooms" :default-open="true" class="h-fit">
          <template v-if="!isLoading">
            <VisibleLazy v-for="room in orphanedRooms.values()" :key="room.room_id" :height="72" use-injection>
              <PageRoomBrowseCard :room :suggested="suggestedRooms.has(room.room_id)" />
            </VisibleLazy>
          </template>

          <template v-else>
            <VisibleLazy v-for="i in 12" :key="i" :height="72" use-injection>
              <USkeleton class="h-18 w-full" />
            </VisibleLazy>
          </template>
        </PageRoomBrowseSection>

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
            <PageRoomBrowseSubspace :space="space" :open :count="space.roomCount" />
          </PageRoomBrowseSection>
        </template>

        <template v-else>
          <USkeleton v-for="key in 4" :key class="h-12" />
        </template>
      </div>
    </div>
  </div>
</template>
