<script lang="ts" setup>
const settings = useSettings()
</script>

<template>
  <SettingsContentLayout>
    <SettingsFormSwitch
      v-model:model-value="settings.messaging.typingEvents"
      :label="SETTINGS__ITEM_METADATA.messaging.typingEvents.title"
      :description="SETTINGS__ITEM_METADATA.messaging.typingEvents.description"
    >
    </SettingsFormSwitch>
  </SettingsContentLayout>
</template>
