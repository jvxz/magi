<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormSwitch
      v-model:model-value="settings.accessibility.uiAnimations"
      :label="SETTINGS_ITEM_METADATA.accessibility.uiAnimations.title"
      :description="SETTINGS_ITEM_METADATA.accessibility.uiAnimations.description"
    >
    </SettingsFormSwitch>
  </SettingsContentLayout>
</template>
