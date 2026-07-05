<script lang="ts" setup>
defineProps<{ notification: AppNotification }>()
</script>

<template>
  <NotificationsPopoverNotiCardInvite v-if="isNotificationType(notification, 'invite')" :notification />
  <NotificationsPopoverNotiCardGeneric v-else-if="isNotificationType(notification, 'generic')" :notification />
  <NotificationsPopoverNotiCardError v-else-if="isNotificationType(notification, 'error')" :notification />
</template>
