<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  middleware: ({ params }) => {
    if ('directRoomId' in params && !params.directRoomId) {
      return navigateTo({
        name: 'me',
      })
    }
  },
  name: 'direct-room',
})

const route = useRoute()
const room = useRoom(() => route.params.directRoomId)

const { self } = useSelf()
const user = useUser(() => room.value?.getMembers().filter(m => m.userId !== self.value?.userId)[0]?.userId)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <UProfilePopoverTrigger
        v-if="user"
        :user
        as-child
        :content-props="{
          sideOffset: 12,
        }"
        :context="{
          from: 'direct',
        }"
      >
        <UButton
          variant="link"
          class="font-normal text-base gap-1 items-center context-menu-open:underline data-[state=open]:no-underline data-[popover-open]:underline!"
        >
          <Icon name="tabler:at" class="text-muted-foreground" />
          <span> {{ room ? resolveRoomName(room) : 'Unknown room' }}</span>
        </UButton>
      </UProfilePopoverTrigger>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <RoomInstance :room="route.params.directRoomId" :with-members-list="false" />
</template>
