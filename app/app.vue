<template>
  <VitePwaManifest />
  <UTooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UTooltipProvider>
  <NuxtAnnouncer />
  <DevOnly>
    <DebugDetails />
  </DevOnly>
</template>
