<template>
  <LayoutAppAsideButton as-child tooltip="Explore">
    <NuxtLink
      :to="{
        name: 'explore',
        params: { baseUrl: 'matrix.org' },
      }"
    >
      <Icon name="tabler:compass-filled" class="text-foreground size-6" />
    </NuxtLink>
  </LayoutAppAsideButton>
</template>
