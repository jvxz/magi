<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const placeholder = computed(() => (currentRoom.value ? `Message in ${currentRoom.value.name}` : '...'))

const msg = shallowRef('')

const { typingMembers } = useRoomMembersTyping.provide(currentRoom)
const areMembersTyping = computed(() => typingMembers.value.size > 0)
</script>

<template>
  <div class="mb-3 px-3 rounded flex-col flex shrink-0 w-full bottom-0 absolute isolate">
    <PageRoomInputMembersTyping />

    <div
      class="px-3.5 border h-user-card-height rounded bg-card-lighter flex gap-3.5 size-full items-center *:shrink-0"
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
      class="absolute w-full h-full -mx-3 pointer-events-none -z-2 bg-linear-to-t ease transition-all from-card to-transparent from-75%"
      :class="areMembersTyping ? '-top-2' : 'top-2'"
    />
  </div>
</template>
