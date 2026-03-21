<script lang="ts" setup>
const { getUserAvatar, userInfo } = useUser()

const { data: avatarUrl, pending } = getUserAvatar('self')
</script>

<template>
  <div class="p-3 h-21 w-full bottom-0 left-0 absolute">
    <div class="border rounded bg-card-2 flex size-full items-center">
      <div class="p-2 px-4 flex gap-2 h-full items-center">
        <UAvatar class="size-8" :class="pending && 'animate-pulse'">
          <UAvatarImage v-if="avatarUrl" :src="avatarUrl" />
        </UAvatar>
        <div class="flex-col h-full">
          <p class="text-sm font-medium">
            {{ userInfo?.displayName }}
          </p>
          <p class="text-2xs text-muted-foreground ">
            {{ userInfo?.presence ? upperFirst(userInfo?.presence) : 'Offline' }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
