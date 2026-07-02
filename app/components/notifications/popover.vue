<script lang="ts" setup>
const { notifications, dismissAll } = useNotifications()

const { sortState } = useSortRegion('notificationsPopover')
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      align="end"
      :class="
        cn(
          popoverContentBase(),
          'z-popover flex flex-col h-96 w-toast p-0',
          'origin-[var(--reka-popper-transform-origin,top_right)]',
          'data-[state=open]:(animate-in fade-in-0 zoom-in-96 ease-snappy)',
          'data-[state=closed]:(animate-out fade-out-0 zoom-out-96 ease-snappy)',
        )
      "
      :side-offset="8"
    >
      <div class="w-full shrink-0 p-1 border-b flex items-center left-px">
        <USortSelect
          :ui="{ trigger: 'rounded-l-md', toggle: 'rounded-r-md', content: 'rounded-md' }"
          :side-offset="5"
          v-model:model-value="sortState"
        />

        <div class="grow shrink-0" />

        <UTooltipRoot>
          <UTooltipTrigger as-child>
            <UButton @click="dismissAll" size="icon-sm" variant="outline" class="rounded-md">
              <Icon name="tabler:checks" />
            </UButton>
          </UTooltipTrigger>

          <UTooltipContent> Dismiss all </UTooltipContent>
        </UTooltipRoot>
      </div>

      <UScrollAreaRoot v-if="notifications.length">
        <UScrollAreaViewport>
          <NotificationsPopoverNotiCard v-for="notification in notifications" :key="notification.id" :notification />
        </UScrollAreaViewport>

        <UScrollAreaScrollbars />
      </UScrollAreaRoot>

      <div v-else class="size-full grid place-items-center">
        <UEmptyRoot>
          <UEmptyIcon variant="naked" name="tabler:inbox" size="sm" />

          <UEmptyDescription> You're all caught up </UEmptyDescription>
        </UEmptyRoot>
      </div>
    </PopoverContent>
  </PopoverPortal>
</template>
