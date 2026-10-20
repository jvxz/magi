<script lang="ts">
export const INJECTION_KEY__IS_TOAST: InjectionKey<true> = Symbol('is-toast')
</script>

<script setup lang="ts">
import type { ToastProviderProps } from 'reka-ui'

import { toRef } from '@vueuse/core'
import { ToastPortal, ToastProvider, ToastViewport, useForwardProps } from 'reka-ui'

import UToast from '../toast/root.vue'

export interface UToastProviderProps extends Omit<ToastProviderProps, 'swipeDirection'> {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  max?: number
}

const props = withDefaults(defineProps<UToastProviderProps>(), {
  duration: 5000,
  max: 5,
  portal: true,
})

const { remove, toasts } = useToast()
provide(INJECTION_KEY__TOAST_MAX, toRef(props, 'max'))
provide(INJECTION_KEY__IS_TOAST, true)

const forwarded = useForwardProps(reactivePick(props, ['duration', 'label', 'swipeThreshold', 'disableSwipe']))

function onUpdateOpen(value: boolean, id: string | number) {
  if (!value) remove(id)
}
</script>

<template>
  <ToastProvider swipe-direction="right" v-bind="forwarded">
    <slot />

    <ToastPortal>
      <ToastViewport
        class="flex flex-col gap-2 w-[calc(100%-2rem)] bottom-8 right-8 fixed z-[100] focus:outline-none sm:w-108"
      >
        <UToast
          v-for="toast of toasts"
          v-bind="omit(toast, ['id', '_duplicate', '_updated', 'payload', 'type'])"
          :key="toast.id"
          :variant="toast.variant"
          @update:open="onUpdateOpen($event, toast.id)"
          @click="toast.onClick?.(toast)"
        >
          <NotificationsContent :notification="toast" />
        </UToast>
      </ToastViewport>
    </ToastPortal>
  </ToastProvider>
</template>
