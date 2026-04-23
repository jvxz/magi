<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const placeholder = computed(() => currentRoom.value ? `Message in ${currentRoom.value.name}` : '...')

const msg = shallowRef('')
</script>

<template>
  <div class="mb-3 px-3 rounded flex shrink-0 h-user-card-height w-full bottom-0 absolute overflow-hidden">
    <div class="px-3.5 border rounded bg-card-lighter flex gap-3.5 size-full items-center *:shrink-0">
      <UButton variant="ghost" size="icon">
        <Icon name="tabler:plus" class="size-5" />
      </UButton>
      <input
        v-model="msg"
        type="text"
        class="text-sm font-sans outline-none flex-1 shrink size-full"
        :placeholder
      />
      <UButton
        variant="ghost"
        size="icon"
        :disabled="!msg"
      >
        <Icon name="tabler:send" class="size-5" />
      </UButton>
    </div>
  </div>
</template>
