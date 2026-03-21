<script lang="ts" setup>
const { getUserAvatar } = useUser()

const { data: avatarUrl, pending } = getUserAvatar('self')
</script>

<template>
  <div class="p-3 h-21 w-full bottom-0 left-0 absolute">
    <div class="px-4 border rounded bg-card-2 flex size-full items-center">
      <UAvatar class="size-8" :class="pending && 'animate-pulse'">
        <UAvatarImage v-if="avatarUrl" :src="avatarUrl" />
      </UAvatar>
    </div>
  </div>
</template>
