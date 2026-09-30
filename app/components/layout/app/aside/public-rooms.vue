<template>
  <LayoutAppAsideButton as-child tooltip="Explore">
    <NuxtLink
      :to="{
        name: 'explore',
        params: { baseUrl: 'matrix.org' },
      }"
      active-class="anchor-name-active"
    >
      <Icon :name="ICON__EXPLORE" class="text-foreground size-6" />
    </NuxtLink>
  </LayoutAppAsideButton>
</template>
