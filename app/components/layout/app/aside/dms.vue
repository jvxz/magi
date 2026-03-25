<template>
  <div class="flex h-header-height w-full w-full justify-center">
    <LayoutAppAsideButton
      as-child
      tooltip="Direct Messages"
      class=""
    >
      <NuxtLink to="/app/me">
        <Icon name="tabler:message-2-filled" class="text-foreground size-6" />
      </NuxtLink>
    </LayoutAppAsideButton>
  </div>
</template>
