<script lang="ts" setup>
import type { UInputTemplateRef } from '~/components/u/input.vue'

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

const contextMenuServer = shallowRef<string | undefined>()
const contextMenuOpen = shallowRef(false)

function handleServerAdd(server: string) {
  servers.value.push(server)
  baseUrl.value = server
}

function handleServerRemove(server?: string) {
  const target = server ?? contextMenuServer.value
  if (target === 'matrix.org')
    return

  servers.value = servers.value.filter(s => s !== target)
}

const inputRef = useTemplateRef<UInputTemplateRef>('inputRef')
onStartTyping(() => inputRef.value?.inputRef?.focus())

onKeyStrokeSafe((e) => {
  const { key } = e
  if (key === 'ArrowRight')
    handlePaginate('f')

  else if (key === 'ArrowLeft')
    handlePaginate('b')
}, { dedupe: true })

function handlePaginate(dir: 'f' | 'b') {
  if (dir === 'f') {
    if (canPaginateForward.value)
      page.value += 1

    return
  }

  if (canPaginateBackward.value)
    page.value -= 1
}
</script>

<template>
  <LayoutAppSlot name="aside">
    <UAsideList>
      <UContextMenu
        v-model="contextMenuOpen"
        @update:open="(e) => {
          if (!e) contextMenuServer = undefined
        }"
      >
        <UContextMenuTrigger class="flex flex-col gap-[2px] w-full *:w-full *:justify-start">
          <UAsideListTab
            v-for="server in servers"
            :key="server"
            :to="{
              name: 'explore',
              params: {
                baseUrl: server,
              },
            }"
            @click.right="contextMenuServer = server"
          >
            <UAsideListButtonIcon icon="tabler:server-2" />

            <span :title="server" class="truncate">{{ server }}</span>
          </UAsideListTab>
        </UContextMenuTrigger>
        <UContextMenuContent v-if="contextMenuServer">
          <UContextMenuItem :disabled="contextMenuServer === 'matrix.org'" @select="handleServerRemove()">
            <Icon name="tabler:trash" />
            Delete
          </UContextMenuItem>
        </UContextMenuContent>
      </UContextMenu>

      <UAsideListSeparator />

      <PageExploreAddServer :servers  @server-submit="handleServerAdd($event)"/>
    </UAsideList>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 grid grid-cols-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:server-2" />
          <p class="font-medium">
            {{ baseUrl }}
          </p>
          <LazyUSpinner v-if="isFetching" class="size-4" />
        </div>

        <div>
          <UInput
            ref="inputRef"
            v-model="query"
            class="w-64 justify-self-end"
            placeholder="Search"
            leading-icon="tabler:search"
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

  <div class="py-page-y-padding h-full relative overflow-y-scroll scrollbar-gutter-stable">
    <div class="mx-auto container max-w-screen-xl space-y-lg">
      <PageExplorePagination
        :page-count="currentPage?.chunk.length"
        :base-url
        :is-fetching-initial="isLoading"
        :can-paginate-backward
        :can-paginate-forward
        :error
      />

      <PageExploreRoomList :current-page :error />

      <PageExplorePagination
        v-if="!error"
        :page-count="currentPage?.chunk.length"
        :base-url
        :is-fetching-initial="isLoading"
        :can-paginate-backward
        :can-paginate-forward
        :error
      />
    </div>

    <Transition name="zoom">
      <UCard
        v-if="error"
        variant="danger"
        class="max-w-md left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2"
      >
        <UCardTitle class="flex gap-2 items-center">
          <Icon name="tabler:alert-triangle" />
          <span>An error occurred</span>
        </UCardTitle>

        <p class="text-pretty">
          The desired homeserver's public rooms could not be loaded. Make sure you have inputted the correct URL
        </p>
      </UCard>
      <UCard
        v-else-if="!currentPage?.chunk.length && !isFetching"
        class="max-w-md left-1/2 top-1/2 absolute -translate-x-1/2 -translate-y-1/2"
      >
        <UCardTitle class="flex gap-2 items-center">
          <Icon name="tabler:question-circle" /> No rooms found
        </UCardTitle>

        <p class="text-pretty">
          <template v-if="!query">
            The desired homeserver does not appear to have any public rooms
          </template>
          <template v-else>
            The search query yielded no results. Try another one
          </template>
        </p>
      </UCard>
    </Transition>
  </div>
</template>
