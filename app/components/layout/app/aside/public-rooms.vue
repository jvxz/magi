<template>
  <UButton
    variant="soft"
    class="rounded-xl flex size-12 items-center justify-center"
    as-child
  >
    <NuxtLink
      :to="{
        name: 'explore',
        params: { baseUrl: 'matrix.org' },
      }"
    >
      <Icon name="mingcute:home-3-fill" class="text-foreground size-6" />
    </NuxtLink>
  </UButton>
</template>
