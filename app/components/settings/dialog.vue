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
      <UDialogContent
        :with-close="false"
        class="grid size-full rounded-none max-w-full sm:max-w-full border-0 md:border md:rounded md:h-[90%] md:w-352 gap-4 p-0"
        @close-auto-focus.prevent
      >
        <TabsRoot v-model:model-value="tab" activation-mode="manual" orientation="vertical" class="flex">
          <SettingsDialogSidebar />

          <div class="flex flex-1 flex-col">
            <UDialogHeader
              class="gap-2 text-center sm:text-left pe-2.5 ps-4 border-b flex shrink-0 h-header-height items-center justify-between"
            >
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
