<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const placeholder = computed(() => currentRoom.value ? `Message in ${currentRoom.value.name}` : '...')

const msg = shallowRef('')
</script>

<template>
  <div class="px-3 rounded flex h-user-card-height w-full absolute bottom-0 overflow-hidden shrink-0 mb-3">
    <div class="px-3.5 border rounded bg-card-2 flex gap-3.5 size-full items-center *:shrink-0">
      <UButton variant="ghost" size="icon">
        <Icon name="tabler:plus" class="size-5" />
      </UButton>
      <input
        v-model="msg"
        type="text"
        class="outline-none flex-1 size-full text-sm font-sans shrink"
        :placeholder
      />
      <UButton variant="ghost" size="icon" :disabled="!msg">
        <Icon name="tabler:send" class="size-5" />
      </UButton>
    </div>
  </div>
</template>
