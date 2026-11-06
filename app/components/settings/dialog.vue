<script lang="ts">
import {
  SettingsContentAccessibility,
  SettingsContentAdvanced,
  SettingsContentAppearance,
  SettingsContentDevices,
  SettingsContentMessaging,
  SettingsContentGeneral,
} from '#components'

const settingComponentMap = {
  accessibility: SettingsContentAccessibility,
  advanced: SettingsContentAdvanced,
  appearance: SettingsContentAppearance,
  devices: SettingsContentDevices,
  general: SettingsContentGeneral,
  messaging: SettingsContentMessaging,
} satisfies Record<SettingsCategory, Component>
</script>

<script lang="ts" setup>
const { open, searchQuery, tab } = useSettingsDialog()

const visited = reactive(new Set<SettingsCategory>())
watchImmediate(tab, t => visited.add(t))

onUnmounted(() => {
  tab.value = SETTINGS__DEFAULT_TAB
  searchQuery.value = ''
})
</script>

<template>
  <UDialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="cn(overlayStyles)" />

      <UDialogContent
        class="p-0 border-0 rounded-none gap-4 grid size-full max-w-full of-clip"
        size="lg"
        @close-auto-focus.prevent
      >
        <UDialogSidebarLayout :get-title="key => SETTINGS__CATEGORY_METADATA[key as SettingsCategory].title">
          <template #sidebar>
            <SettingsDialogSidebar />
          </template>

          <div class="flex flex-1 flex-col size-full">
            <component :is="settingComponentMap[tab]" />
          </div>
        </UDialogSidebarLayout>
      </UDialogContent>
    </DialogPortal>
  </UDialogRoot>
</template>
