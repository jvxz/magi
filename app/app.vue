<template>
  <VitePwaManifest />

  <UTooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <DialogProvider />
  </UTooltipProvider>
  <UToastProvider />

  <NuxtAnnouncer />
</template>
