<template>
  <VitePwaManifest />
  <UTooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UTooltipProvider>
  <DevOnly>
    <DebugDetails />
  </DevOnly>
</template>
