<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <USettingSwitch
      v-model:model-value="settings.messaging.typingEvents"
      :label="SETTINGS__ITEM_METADATA.messaging.typingEvents.title"
      :description="SETTINGS__ITEM_METADATA.messaging.typingEvents.description"
    />
  </SettingsContentLayout>
</template>
