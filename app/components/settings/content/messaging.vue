<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormSwitch
      v-model:model-value="settings.messaging.typingEvents"
      :label="SETTINGS_ITEM_METADATA.messaging.typingEvents.title"
      :description="SETTINGS_ITEM_METADATA.messaging.typingEvents.description"
    >
    </SettingsFormSwitch>
  </SettingsContentLayout>
</template>
