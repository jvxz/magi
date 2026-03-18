<template>
  <NuxtLink
    :to="{
      name: 'explore',
      params: { baseUrl: 'matrix.org' },
    }"
  >
    <button class="rounded-xl bg-muted flex size-12 items-center justify-center">
      <Icon name="mingcute:home-3-fill" class="text-foreground size-6" />
    </button>
  </NuxtLink>
</template>
