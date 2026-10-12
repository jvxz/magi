<script lang="ts" setup>
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
const invitedMemberCount = useRoomComputed(spaceId, r => r?.getInvitedMemberCount())
const creator = useRoomComputed(spaceId, r => r?.getCreator())

const { openDialog } = useGlobalDialog()

const inputQuery = useUrlSearchParams('history', {
  initialValue: {
    q: '',
  },
  removeFalsyValues: true,
})
const hasQuery = computed(() => !!inputQuery.q.trim().length)
// const inputPlaceholder = computed(() =>
//   members.value
//     ? `Search ${members.value.length} ${handlePlural(members.value.length, 'members', 'member')}`
//     : 'Search members',
// )

const input = useTemplateRef('input')
useAutoType(() => input.value?.$el as HTMLElement)

const scrollEl = useTemplateRef<HTMLDivElement>('scrollEl')

const filteredMembers = useFilter(members, {
  keys: ['name', 'userId'],
  query: () => inputQuery.q,
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
        <UShowcaseHeader>
          <UShowcaseTitle>
            <span>Members</span>
          </UShowcaseTitle>

          <UShowcaseDetails>
            <UShowcaseDetailsItem>
              <Icon :name="ICON__MEMBER_COUNT" />
              <span>{{ filteredMembers.length }} joined</span>
            </UShowcaseDetailsItem>

            <template v-if="!hasQuery">
              <UInlineSeparator />
              <UShowcaseDetailsItem>
                <Icon :name="ICON__INVITE" />
                <span>{{ invitedMemberCount }} invited</span>
              </UShowcaseDetailsItem>
            </template>
            <p v-else class="text-muted-foreground">(filtered)</p>
          </UShowcaseDetails>
        </UShowcaseHeader>

        <div class="self-end">
          <UInput
            v-model:model-value="inputQuery.q"
            ref="input"
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
            :estimate-size="(_, i) => (i ? 57 : 40)"
            :get-item-key="member => member.userId"
            :gap="16"
            row-class="flex flex-col gap-4"
          >
            <UCardGroupSeparator v-if="index" />

            <UCardGroupItem variant="raised">
              <div class="flex gap-2 items-center">
                <button
                  @click="
                    openDialog('avatar', {
                      type: 'roomMember',
                      member,
                      label: resolveUserName(member),
                      room: spaceId!,
                    })
                  "
                  class="p-0 relative of-clip cursor-pointer shrink-0"
                >
                  <MatrixRoomMemberAvatar
                    class="rounded-sm size-10"
                    :room="spaceId"
                    :member
                    square
                    image-size="small"
                  />

                  <div aria-hidden="true" class="hover:bg-hover-overlay absolute inset-0 size-full" />
                </button>

                <UCardGroupItemHeader class="gap-1 justify-center">
                  <UCardGroupItemTitle as="div" :title="resolveUserName(member)" class="flex items-center gap-2">
                    <p class="truncate">{{ resolveUserName(member) }}</p>

                    <UTooltipRoot>
                      <UTooltipTrigger as-child>
                        <Icon v-if="member.userId === creator" class="text-primary" :name="ICON__CREATOR" />
                      </UTooltipTrigger>
                      <UTooltipContent> Owner </UTooltipContent>
                    </UTooltipRoot>
                  </UCardGroupItemTitle>

                  <UCardGroupItemDescription :title="member.userId" class="flex items-center">
                    <UClickToCopy side="right" as-child :with-title="false">
                      <UButton variant="ghost-inline" class="shrink text-xs font-normal">
                        <span class="truncate">{{ member.userId }}</span>
                      </UButton>
                    </UClickToCopy>

                    <!-- spacer for copy indicator -->
                    <span aria-hidden="true" class="w-4 shrink-0" />
                  </UCardGroupItemDescription>
                </UCardGroupItemHeader>
              </div>
            </UCardGroupItem>
          </VirtualList>

          <template v-else>
            <template v-for="i in cachedCount" :key="i">
              <UCardGroupSeparator v-if="i > 1" />

              <UCardGroupItem variant="raised" class="h-2.5rem">
                <USkeleton class="size-full rounded-sm" />
              </UCardGroupItem>
            </template>
          </template>

          <UEmptyRoot v-if="isQueryEmpty" class="h-full flex items-center justify-center pt-12">
            <UEmptyIcon variant="naked" :name="ICON__EMPTY" />
            <UEmptyTitle>No members found</UEmptyTitle>
            <UEmptyDescription>Try adjusting your search query</UEmptyDescription>
          </UEmptyRoot>
        </UCardGroupRoot>
      </UShowcaseContent>
    </UShowcaseRoot>
  </div>
</template>
