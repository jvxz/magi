<script lang="ts" setup>
definePageMeta({
  layout: 'app',
  name: 'me',
})
</script>

<template>
  <LayoutAppSlot name="aside-header">
    <div class="p-2.5 size-full">
      <UButton variant="soft" class="py-4 w-full">
        <p class="text-xs">
          Find or start a conversation
        </p>
      </UButton>
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="aside">
    <div class="p-1">
      <PageMeAsideButtons />
    </div>
  </LayoutAppSlot>

  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader>
      <div class="px-6 flex gap-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:door" />
          <p>
            Recent rooms
          </p>
        </div>
      </div>
    </LayoutAppPageHeader>
  </LayoutAppSlot>

  <NuxtPage />
</template>
