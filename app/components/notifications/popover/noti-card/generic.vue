<script lang="ts" setup>
defineProps<{ notification: AppNotification<'generic'> }>()
</script>

<template>
  <NotificationsPopoverNotiCard
    :description="notification.payload.description"
    :title="notification.payload.title"
    :id="notification.id"
  />
</template>
