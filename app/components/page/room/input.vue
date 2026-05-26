<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const placeholder = computed(() => (currentRoom.value ? `Message in ${currentRoom.value.name}` : '...'))

const msg = shallowRef('')

const { areMembersTyping } = useRoomMembersTyping.provide(currentRoom)
</script>

<template>
  <div class="mb-3 px-3 rounded flex shrink-0 flex-col w-full bottom-0 absolute isolate">
    <PageRoomInputMembersTyping />

    <div
      class="px-3.5 border rounded bg-card-lighter flex gap-3.5 size-full h-user-card-height items-center *:shrink-0"
    >
      <UButton variant="ghost" size="icon">
        <Icon name="tabler:plus" class="size-5" />
      </UButton>
      <input v-model="msg" type="text" class="text-sm font-sans outline-none flex-1 shrink size-full" :placeholder />
      <UButton variant="ghost" size="icon" :disabled="!msg">
        <Icon name="tabler:send" class="size-5" />
      </UButton>
    </div>

    <div
      aria-hidden
      aria-busy
      class="h-full w-full pointer-events-none transition-all ease absolute from-card to-transparent from-75% bg-linear-to-t -mx-3 -z-2"
      :class="areMembersTyping ? '-top-2' : 'top-2'"
    />
  </div>
</template>
