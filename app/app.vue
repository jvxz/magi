<template>
  <VitePwaManifest />

  <UTooltipProvider>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UTooltipProvider>
  <UToastProvider />
  <DialogProvider />

  <NuxtAnnouncer />
</template>
