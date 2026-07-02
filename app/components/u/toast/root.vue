<script lang="ts">
export const TOAST_EXIT_MS = 150
</script>

<script lang="ts" setup>
import type { ToastRootEmits, ToastRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

import type { ButtonProps } from '../button.vue'

export type UToastProps = ToastRootProps & {
  class?: string
  title?: string
  description?: string
  icon?: string
  variant?: AlertVariants
  actions?: (ButtonProps & { label: string })[]
  withClose?: boolean
}
export type UToastEmits = ToastRootEmits

const props = withDefaults(defineProps<UToastProps>(), {
  variant: 'default',
  withClose: true,
})
const emits = defineEmits<UToastEmits>()

const picked = reactivePick(props, ['as', 'defaultOpen', 'open', 'duration', 'type'])
const forwarded = useForwardPropsEmits(picked, emits)
</script>

<template>
  <ToastRoot v-bind="forwarded" data-slot="toast-root" as-child>
    <UAlertRoot
      :class="
        cn(
          'flex flex-row gap-2 toast-anim p-4 w-full relative',
          'data-[swipe=move]:translate-x-(--reka-toast-swipe-move-x)',
          'data-[swipe=cancel]:(translate-x-0 transition-transform)',
          $props.class,
        )
      "
    >
      <ToastClose as-child>
        <UButton size="icon" aria-label="Close" variant="ghost" class="absolute top-4 right-4 size-6 rounded-sm">
          <Icon name="tabler:x" />
        </UButton>
      </ToastClose>

      <UAlertIcon v-if="icon" :name="icon" />

      <UAlertContent data-slot="toast-content">
        <ToastTitle data-slot="toast-title" as-child>
          <UAlertTitle class="font-medium">{{ title }}</UAlertTitle>
        </ToastTitle>
        <ToastDescription v-if="description" data-slot="toast-description" as-child>
          <UAlertDescription class="text-sm">{{ description }}</UAlertDescription>
        </ToastDescription>

        <UAlertFooter v-if="actions?.length" class="pt-1 flex gap-1 items-center justify-end" data-slot="toast-footer">
          <ToastAction v-for="action of actions" :key="action.label" :alt-text="action.label" as-child>
            <UButton v-bind="action" :class="cn('w-fit self-end', action.class)">
              {{ action.label }}
            </UButton>
          </ToastAction>
        </UAlertFooter>
      </UAlertContent>
    </UAlertRoot>
  </ToastRoot>
</template>

<style>
.toast-anim {
  @apply ease-snappy;
  animation-duration: 150ms;
  animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1);

  &[data-state='open'] {
    animation-name: toast-slide-in-right;
  }
  &[data-state='closed'] {
    animation-name: toast-slide-right;
  }
  &[data-swipe='end'] {
    animation-name: toast-slide-right;
  }
}

/* https://github.com/nuxt/ui/blob/3bf1a92a9d3aa47ee7f02c1b2363363bc906f313/src/runtime/keyframes.css#L141-L149 */
@keyframes toast-slide-in-right {
  from {
    transform: translateX(calc(100% + 2rem));
  }
  to {
    transform: translateX(0);
  }
}
@keyframes toast-slide-right {
  from {
    transform: translateX(var(--reka-toast-swipe-end-x));
  }
  to {
    transform: translateX(calc(100% + 2rem));
  }
}
</style>
