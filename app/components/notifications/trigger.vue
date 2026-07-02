<script lang="ts" setup>
const popoverOpen = ref(false)
const tooltipOpen = ref(false)
</script>

<template>
  <UTooltipRoot
    :open="tooltipOpen"
    @update:open="
      e => {
        if (!popoverOpen) tooltipOpen = e
      }
    "
  >
    <PopoverRoot v-model:open="popoverOpen">
      <UTooltipTrigger as-child>
        <PopoverTrigger as-child>
          <UButton variant="ghost" class="p-0 size-6">
            <Icon name="tabler:inbox" class="size-4" />
          </UButton>
        </PopoverTrigger>
      </UTooltipTrigger>

      <UTooltipContent> Notifications </UTooltipContent>

      <NotificationsPopover />
    </PopoverRoot>
  </UTooltipRoot>
</template>
