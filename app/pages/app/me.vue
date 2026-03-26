<script lang="ts" setup>
definePageMeta({
  name: 'me',
})
</script>

<template>
  <NuxtLayout name="app">
    <template #aside-header>
      <div class="p-2.5 size-full">
        <UButton variant="soft" class="py-4 w-full">
          <p class="text-xs">
            Find or start a conversation
          </p>
        </UButton>
      </div>
    </template>

    <template #aside>
      <div class="p-1">
        <PageMeAsideButtons />
      </div>
    </template>

    <template #header>
      <div class="px-6 flex gap-2 h-full items-center">
        <div class="flex gap-2 items-center">
          <Icon name="tabler:door" />
          <p>
            Recent rooms
          </p>
        </div>
      </div>
    </template>

    <p>dms</p>
  </NuxtLayout>
</template>
