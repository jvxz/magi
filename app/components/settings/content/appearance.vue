<script lang="ts" setup>
const settings = useSettings()

const palette = computed({
  get: () => settings.value.appearance.palette,
  set: (e: string) => (settings.value.appearance.palette = e.toLowerCase()),
})
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormAutocomplete
      v-model:model-value="settings.appearance.font"
      :label="SETTINGS__ITEM_METADATA.appearance.font.title"
      :description="SETTINGS__ITEM_METADATA.appearance.font.description"
      :options="SETTINGS__ITEM_METADATA.appearance.font.options"
      :default-option="SETTINGS__DEFAULTS.appearance.font"
    />

    <USeparator />

    <SettingsFormAutocomplete
      v-model:model-value="palette"
      :label="SETTINGS__ITEM_METADATA.appearance.palette.title"
      :description="SETTINGS__ITEM_METADATA.appearance.palette.description"
      :options="$config.public.colorModes.map(c => upperFirst(c))"
      :default-option="SETTINGS__DEFAULTS.appearance.palette"
    >
      <template #selectValue="{ modelValue }">
        {{ upperFirst(modelValue!) }}
      </template>
    </SettingsFormAutocomplete>
  </SettingsContentLayout>
</template>
