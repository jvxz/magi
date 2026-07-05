<script lang="ts" setup>
import type { UToastProps } from '~/components/u/toast/root.vue'

export type NotiCardProps = Pick<UToastProps, 'description' | 'title' | 'actions' | 'icon'> &
  Pick<AppNotification, 'id'>

const props = defineProps<NotiCardProps>()
const emits = defineEmits<{
  dismiss: []
}>()

const { dismiss } = useNotifications()
function handleDismiss() {
  emits('dismiss')
  dismiss(props.id)
}

const isToast = inject<true>('isToast')
</script>

<template>
  <UAlertIcon v-if="icon" :name="icon" />

  <UAlertContent class="size-full shrink-0">
    <slot>
      <UToastTitle v-if="title">
        {{ title }}
      </UToastTitle>

      <UToastDescription v-if="description">
        {{ description }}
      </UToastDescription>
    </slot>

    <slot name="footer" :handle-dismiss :is-toast>
      <UAlertFooter>
        <UButton v-if="!isToast" size="sm" @click="handleDismiss"> Dismiss </UButton>
      </UAlertFooter>
    </slot>
  </UAlertContent>
</template>
