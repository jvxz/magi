<script lang="ts" setup>
const { me } = useUser()
</script>

<template>
  <div class="px-1.75 shrink-0 py-1.25 rounded-sm flex gap-2 h-full flex-1 cursor-pointer duration-150 items-center -mx-1.75 -my-1.25 hover:bg-white/7.5">
    <MatrixAvatar
      v-if="me"
      loading="eager"
      fetchpriority="high"
      :user="me"
      :size="36"
      class="max-h-full"
    />
    <div class="flex-col size-full *:shrink-0 -translate-y-0.5">
      <p v-if="me?.displayName" class="text-sm font-medium h-1lh">
        {{ me.displayName }}
      </p>
      <USkeleton v-else class="text-sm py-2 shrink h-1lh w-24" />

      <div class="h-0.6lh w-full relative overflow-hidden *:duration-150 *:ease">
        <p class="text-2xs text-muted-foreground bottom-0 absolute group-hover:bottom-1lh">
          {{ me?.presence ? upperFirst(me?.presence) : 'Offline' }}
        </p>
        <p class="text-2xs text-muted-foreground top-1lh absolute group-hover:top-0">
          {{ me?.userId }}
        </p>
      </div>
    </div>
  </div>
</template>
