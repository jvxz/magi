<script lang="ts" setup>
const { open, tab } = useSettingsDialog()

onUnmounted(() => tab.value = SETTINGS_DEFAULT_TAB)
</script>

<template>
  <UDialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="cn(overlayStyles)" />
      <DialogContent
        data-slot="dialog-content"
        :class="
          cn(
            staticStyles.base,
            staticStyles.variant.default,
            'fixed top-[50%] left-[50%] z-50 grid w-full h-full rounded-none border-0 md:border md:rounded md:h-[90%] md:w-[87rem] md:max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out data-[state=open]:zoom-in-95 p-0',
          )"
        @close-auto-focus.prevent
      >
        <TabsRoot
          v-model:model-value="tab"
          activation-mode="manual"
          orientation="vertical"
          class="flex"
        >
          <SettingsDialogSidebar />

          <div class="flex flex-1 flex-col">
            <header class="pe-2.5 ps-4 border-b flex shrink-0 h-header-height items-center justify-between">
              <DialogTitle class="font-medium">
                My Account
              </DialogTitle>

              <DialogClose
                :class="cn(
                  interactiveStyles.base,
                  interactiveStyles.variant.ghost,
                  interactiveStyles.size.icon,
                  'inline-flex size-8 items-center justify-center opacity-70',
                )"
              >
                <Icon name="tabler:x" class="size-5" />
                <VisuallyHidden>Close</VisuallyHidden>
              </DialogClose>
            </header>

            <TabsContent
              v-for="setting in SETTINGS_CATEGORY_METADATA"
              :key="setting.key"
              :value="setting.key"
            >
              <SettingsContent :category="setting.key" />
            </TabsContent>
          </div>
        </TabsRoot>
      </DialogContent>
    </DialogPortal>
  </UDialogRoot>
</template>
