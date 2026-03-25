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
    <p>dms</p>
  </NuxtLayout>
</template>
