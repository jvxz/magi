<script lang="ts" setup>
const { getUserAvatar, userInfo } = useUser()

const { data: avatarUrl, pending } = getUserAvatar('self')
</script>

<template>
  <div class="p-3 h-21 w-full bottom-0 left-0 absolute group">
    <div class="border rounded bg-card-2 flex size-full items-center">
      <div class="p-3 flex gap-2 w-full items-center">
        <div class="p-1.5 rounded-sm flex gap-2 h-full w-full cursor-pointer duration-150 items-center -m-1.5 hover:bg-white/7.5">
          <UAvatar class="size-8" :class="pending && 'animate-pulse'">
            <UAvatarImage v-if="avatarUrl" :src="avatarUrl" />
          </UAvatar>
          <div class="flex-col size-full -translate-y-0.5 ">
            <p class="text-sm font-medium">
              {{ userInfo?.displayName }}
            </p>
            <div class="overflow-hidden relative h-0.6lh w-full *:duration-150 *:ease">
              <p class="text-2xs text-muted-foreground absolute bottom-0 group-hover:bottom-1lh">
                {{ userInfo?.presence ? upperFirst(userInfo?.presence) : 'Offline' }}
              </p>
              <p class="text-2xs text-muted-foreground absolute top-1lh group-hover:top-0">
                {{ userInfo?.userId }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
