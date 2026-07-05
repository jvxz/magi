<script lang="ts" setup>
defineProps<{ notification: AppNotification<'error'> }>()

const { copy } = useClipboard()
</script>

<template>
  <NotificationsPopoverNotiCard
    :description="notification.payload.description"
    :title="notification.payload.title"
    :id="notification.id"
    icon="tabler:exclamation-circle"
  >
    <template #footer="{ handleDismiss, isToast }">
      <UAlertFooter>
        <UButton v-if="!isToast" size="sm" @click="handleDismiss"> Dismiss </UButton>
        <UButton variant="danger" size="sm" @click="copy(notification.payload.raw)"> Copy error </UButton>
      </UAlertFooter>
    </template>
  </NotificationsPopoverNotiCard>
</template>
