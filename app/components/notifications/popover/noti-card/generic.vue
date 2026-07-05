<script lang="ts" setup>
defineProps<{ notification: AppNotification<'generic'> }>()
</script>

<template>
  <NotificationsPopoverNotiCard
    :id="notification.id"
    :description="notification.payload.description"
    :title="notification.payload.title"
  />
</template>
