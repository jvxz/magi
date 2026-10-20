<script lang="ts">
export interface SpaceMembersListContext {
  inputQuery: Ref<string>
  spaceId: ComputedRef<string | undefined>
  filteredMembers: ComputedRef<RoomMember[]>
}

export const [injectSpaceMembersListContext, provideSpaceMembersListContext] =
  createContext<SpaceMembersListContext>('SpaceMembersList')
</script>

<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'

definePageMeta({
  layout: 'app',
  name: 'space-members',
})

const spaceId = useCurrentSpaceId()

const { members, isLoaded } = useRoomMembers(spaceId, { sortByPowerlevel: true })
const cachedCount = useCachedCount(
  () => `${spaceId.value}-member-count`,
  () => (isLoaded.value ? Math.min(24, members.value.length) : undefined),
  4,
)

const params = useUrlSearchParams('history', {
  initialValue: {
    q: '',
  },
  removeFalsyValues: true,
})
const inputQuery = computed({
  get: () => params.q,
  set: value => (params.q = value),
})
const hasQuery = computed(() => !!inputQuery.value.trim().length)

const input = useTemplateRef('input')
useAutoType(() => input.value?.$el as HTMLElement)

const scrollEl = useTemplateRef<HTMLDivElement>('scrollEl')

const filteredMembers = useFilter(members, {
  keys: ['name', 'userId'],
  query: inputQuery,
})

const isQueryEmpty = computed(
  () =>
    // members loaded
    !!members.value.length &&
    // query is not empty
    hasQuery.value &&
    // no results
    filteredMembers.value.length === 0,
)

provideSpaceMembersListContext({
  filteredMembers,
  inputQuery,
  spaceId,
})
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader class="flex gap-2 items-center">
      <Icon :name="ICON__MEMBERS" />
      <span>Members</span>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <div ref="scrollEl" class="py-page-y-padding h-full relative overflow-y-scroll scrollbar-gutter-stable">
    <UShowcaseRoot>
      <div class="flex items-center justify-between">
        <PageSpaceMembersHeader :space-id :filtered-members />

        <div class="self-end">
          <UInput
            ref="input"
            v-model:model-value="inputQuery"
            variant="raised"
            class="w-64"
            placeholder="Search..."
            :leading-icon="ICON__SEARCH"
          />
        </div>
      </div>

      <UShowcaseSeparator />

      <UShowcaseContent>
        <UCardGroupRoot variant="raised" :ghost="isQueryEmpty">
          <VirtualList
            v-if="isLoaded"
            v-slot="{ item: member, index }"
            :items="filteredMembers"
            :scroll-el="scrollEl"
            :estimate-size="() => 72"
            :get-item-key="member => member.userId"
            :gap="0"
            row-class="flex flex-col"
          >
            <UCardGroupSeparator v-if="index" />

            <PageSpaceMembersCard :member />
          </VirtualList>

          <template v-else>
            <template v-for="i in cachedCount" :key="i">
              <UCardGroupSeparator v-if="i > 1" />

              <UCardGroupItem variant="raised" class="h-18">
                <USkeleton class="rounded-sm size-full" />
              </UCardGroupItem>
            </template>
          </template>

          <UEmptyRoot v-if="isQueryEmpty" class="pt-12 flex h-full items-center justify-center">
            <UEmptyIcon variant="naked" :name="ICON__EMPTY" />
            <UEmptyTitle>No members found</UEmptyTitle>
            <UEmptyDescription>Try adjusting your search query</UEmptyDescription>
          </UEmptyRoot>
        </UCardGroupRoot>
      </UShowcaseContent>
    </UShowcaseRoot>
  </div>
</template>
