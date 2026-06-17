<template>
  <div class="flex h-header-height w-full justify-center">
    <LayoutAppAsideButton as-child tooltip="Home" class="relative">
      <NuxtLink :to="{ name: 'me' }" exact-active-class="anchor-name-active">
        <Icon name="tabler:home" class="text-foreground size-6" />
      </NuxtLink>
    </LayoutAppAsideButton>
  </div>
</template>
