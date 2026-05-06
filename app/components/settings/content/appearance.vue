<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormAutocomplete
      v-model:model-value="settings.appearance.font"
      :label="SETTINGS_ITEM_METADATA.appearance.font.title"
      :description="SETTINGS_ITEM_METADATA.appearance.font.description"
      :options="SETTINGS_ITEM_METADATA.appearance.font.options"
      :default-option="DEFAULT_SETTINGS.appearance.font"
    />
  </SettingsContentLayout>
</template>
