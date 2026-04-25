<script lang="ts" setup>
const { self } = useSelf()
</script>

<template>
  <UProfilePopoverTrigger
    v-if="self"
    :user="self"
    :content-props="{
      sideOffset: 18,
      alignOffset: -8,
      side: 'top',
    }"
    as-child
    class="group"
  >
    <button class="px-1.75 py-1.25 rounded-sm flex flex-1 shrink-0 gap-2 h-full cursor-pointer duration-150 items-center -mx-1.75 -my-1.25 hover:bg-white/7.5">
      <MatrixAvatar
        loading="eager"
        fetchpriority="high"
        :user="self?.userId"
        :size="36"
        class="max-h-full"
        image-size="small"
      />
      <div class="flex-col size-full *:shrink-0 -translate-y-0.5">
        <p v-if="self?.displayName" class="text-sm font-medium h-1lh w-fit self-start">
          {{ self.displayName }}
        </p>
        <USkeleton v-else class="text-sm py-2 shrink h-1lh w-24" />

        <div class="h-0.6lh w-full relative overflow-hidden *:duration-150 *:ease">
          <p class="text-2xs text-muted-foreground bottom-0 absolute group-data-[popover-open]:bottom-1lh group-hover:bottom-1lh">
            {{ self?.presence ? upperFirst(self?.presence) : 'Offline' }}
          </p>
          <p class="text-2xs text-muted-foreground top-1lh absolute group-data-[popover-open]:top-0 group-hover:top-0">
            {{ self?.userId }}
          </p>
        </div>
      </div>
    </button>
  </UProfilePopoverTrigger>
</template>
