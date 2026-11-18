<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <USettingSwitch
      v-model:model-value="settings.accessibility.uiAnimations"
      :label="SETTINGS__ITEM_METADATA.accessibility.uiAnimations.title"
      :description="SETTINGS__ITEM_METADATA.accessibility.uiAnimations.description"
    />
  </SettingsContentLayout>
</template>
