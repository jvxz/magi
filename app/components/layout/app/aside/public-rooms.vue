<template>
  <LayoutAppAsideButton as-child tooltip="Explore">
    <NuxtLink
      :to="{
        name: 'explore',
        params: { baseUrl: 'matrix.org' },
      }"
    >
      <Icon name="mingcute:compass-fill" class="text-foreground size-6" />
    </NuxtLink>
  </LayoutAppAsideButton>
</template>
