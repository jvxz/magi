<script lang="ts" setup>
const { open, searchQuery, tab } = useSettingsDialog()

onUnmounted(() => {
  tab.value = SETTINGS_DEFAULT_TAB
  searchQuery.value = ''
})
</script>

<template>
  <UDialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="cn(overlayStyles)" />
      <UDialogContent :with-close="false" class="grid" @close-auto-focus.prevent>
        <TabsRoot v-model:model-value="tab" activation-mode="manual" orientation="vertical" class="flex">
          <SettingsDialogSidebar />

          <div class="flex flex-1 flex-col">
            <UDialogHeader>
              <DialogTitle class="font-medium">
                {{ SETTINGS_CATEGORY_METADATA[tab].title }}
              </DialogTitle>

              <VisuallyHidden>
                <DialogDescription> {{ SETTINGS_CATEGORY_METADATA[tab].title }} settings </DialogDescription>
              </VisuallyHidden>
            </UDialogHeader>

            <TabsContent v-for="setting in SETTINGS_CATEGORY_METADATA" :key="setting.key" :value="setting.key">
              <SettingsContent :category="setting.key" />
            </TabsContent>
          </div>
        </TabsRoot>
      </UDialogContent>
    </DialogPortal>
  </UDialogRoot>
</template>
