<script lang="ts" setup>
defineProps<{ notification: AppNotification }>()

const { dismiss } = useNotifications()
</script>

<template>
  <UAlertRoot variant="ghost" class="rounded-0 shrink-0 w-full not-last:border-b">
    <UAlertIcon v-if="notification.icon" :name="notification.icon" />

    <UAlertContent>
      <UAlertTitle v-if="notification.title">
        {{ notification.title }}
      </UAlertTitle>

      <UAlertDescription v-if="notification.description">
        {{ notification.description }}
      </UAlertDescription>

      <UAlertFooter>
        <UButton size="sm" @click="dismiss(notification.id)"> Dismiss </UButton>

        <UButton
          v-for="action in notification.actions"
          :key="action.label"
          v-bind="omit(action, ['label'])"
          :class="cn('w-fit self-end', action.class)"
        >
          <span>{{ action.label }}</span>
        </UButton>
      </UAlertFooter>
    </UAlertContent>
  </UAlertRoot>
</template>
