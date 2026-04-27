<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ['explore'],
  name: 'explore',
})

const route = useRoute()
const baseUrl = computed({
  get: () => {
    if (typeof route.params.baseUrl === 'string')
      return route.params.baseUrl

    return route.params.baseUrl?.[0]
  },
  set: value => navigateTo({
    name: 'explore',
    params: { baseUrl: value },
  }),
})

const servers = useLocalStorage('explore:servers', () => ['matrix.org', 'mozilla.org', 'unredacted.org'])
const { page, query } = usePublicRoomsState(baseUrl.value)

const { canPaginateBackward, canPaginateForward, currentPage, error, isFetching, isLoading } = usePublicRooms(baseUrl, page, query)
</script>

<template>
  <LayoutAppSlot name="aside">
    <div class="p-2.5 flex flex-col gap-2.5">
      <UToggleGroupRoot
        v-model="baseUrl"
        class="flex flex-col gap-2.5 w-full"
        required
      >
        <UToggleGroupItem
          v-for="server in servers"
          :key="server"
          :value="server"
          class="text-base px-4 text-left h-12 w-full justify-start"
        >
          {{ server }}
        </UToggleGroupItem>
      </UToggleGroupRoot>
      <UDialogRoot>
        <UDialogTrigger as-child>
          <UButton
            variant="soft"
            class="text-base px-4 h-12 w-full justify-start"
          >
            <Icon name="tabler:plus" class="" />
            Add server
          </UButton>
        </UDialogTrigger>
        <UDialogContent>
          <p>Hello</p>
        </UDialogContent>
      </UDialogRoot>
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 grid grid-cols-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:server-2" />
          <p>{{ baseUrl }}</p>
          <LazyUSpinner v-if="isFetching" class="size-4" />
        </div>

        <div>
          <UInput
            v-model="query"
            class="w-64 justify-self-end"
            placeholder="Search"
          />
        </div>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <LayoutAppSlot name="aside-header">
    <div class="p-2.5 px-4 flex size-full items-center">
      <p>Explore</p>
    </div>
  </LayoutAppSlot>

  <div
    class="py-page-y-padding h-full scrollbar-gutter-stable"
    :class="currentPage ? 'overflow-y-auto' : 'overflow-y-hidden'"
  >
    <div class="mx-auto container max-w-screen-xl space-y-lg">
      <PageExplorePagination
        :base-url
        :is-fetching-initial="isLoading"
        :can-paginate-backward
        :can-paginate-forward
      />
      <PageExploreRoomList :has-error="!!error" :current-page />
      <PageExplorePagination
        :base-url
        :is-fetching-initial="isLoading"
        :can-paginate-backward
        :can-paginate-forward
      />
    </div>
  </div>
</template>
