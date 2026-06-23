<script lang="ts" setup>
const { self } = useSelf()
</script>

<template>
  <UProfilePopoverTrigger
    :user="self"
    :content-props="{
      sideOffset: 14,
      alignOffset: -8,
      side: 'top',
      align: 'start',
    }"
    as-child
  >
    <button
      class="group -mx-1.5 rounded-sm text-foreground ps-1 flex flex-1 shrink-0 gap-1 w-full h-11 cursor-pointer duration-150 items-center hover:bg-white/7.5"
    >
      <MatrixAvatar
        loading="eager"
        fetchpriority="high"
        :user="self"
        class="h-full py-1 w-auto aspect-square shrink-0"
      />

      <div class="flex-col size-full translate-y-0.5 *:shrink-0 justify-between">
        <p v-if="self?.displayName" class="text-sm font-medium h-1lh w-fit self-start">
          {{ self.displayName }}
        </p>
        <USkeleton v-else class="text-sm py-2 shrink h-1lh w-24" />

        <div class="h-4 w-full relative overflow-hidden *:duration-150 *:ease">
          <p
            class="text-2xs text-muted-foreground bottom-0 absolute group-data-[popover-open]:bottom-1lh group-hover:bottom-1lh"
          >
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
