<script lang="ts" setup>
const settings = useSettings()

const palette = computed({
  get: () => settings.value.appearance.palette,
  set: (e: string) => (settings.value.appearance.palette = e.toLowerCase()),
})
</script>

<template>
  <SettingsContentLayout>
    <USettingSwitch
      v-model:model-value="settings.appearance.useSystem"
      variant="top"
      :label="SETTINGS__ITEM_METADATA.appearance.useSystem.title"
      :description="SETTINGS__ITEM_METADATA.appearance.useSystem.description"
    />

    <USeparator />

    <USettingSelect
      v-model:model-value="palette"
      :label="SETTINGS__ITEM_METADATA.appearance.palette.title"
      :description="SETTINGS__ITEM_METADATA.appearance.palette.description"
      :options="$config.public.colorModes.map(c => upperFirst(c))"
    >
      <template #selectValue="{ modelValue }">
        {{ upperFirst(modelValue!) }}
      </template>
    </USettingSelect>
  </SettingsContentLayout>
</template>
