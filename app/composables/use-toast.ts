// https://github.com/nuxt/ui/blob/dde09d06486e68b1b4dd4538f91fefd08a3d7548/src/runtime/composables/useToast.ts
import type { EmitsToProps, InjectionKey, Ref } from 'vue'

import type { UToastEmits, UToastProps } from '~/components/u/toast/root.vue'

import { TOAST_EXIT_MS } from '~/components/u/toast/root.vue'

export const toastMaxInjectionKey: InjectionKey<Ref<number | undefined>> = Symbol('toast-max')

export interface Toast extends Omit<UToastProps, 'defaultOpen'>, EmitsToProps<UToastEmits>, AppNotification {
  onClick?: (toast: Toast) => void
  _duplicate?: number
  _updated?: boolean
}

const toasts = shallowRef<Toast[]>([])

export function useToast() {
  const max = inject(toastMaxInjectionKey, undefined)

  const running = ref(false)
  const queue: Toast[] = []

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  async function processQueue() {
    if (running.value || queue.length === 0) {
      return
    }

    running.value = true

    while (queue.length > 0) {
      const toast = queue.shift()!

      await nextTick()

      toasts.value = [...toasts.value, toast].slice(-(max?.value ?? 5))
    }

    running.value = false
  }

  function add(toast: Partial<Toast> & Pick<AppNotification, 'key'>): Toast {
    const body = {
      id: generateId(),
      open: true,
      ...toast,
    } as Toast

    const existingIndex = toasts.value.findIndex((t: Toast) => t.id === body.id)
    if (existingIndex !== -1) {
      toasts.value[existingIndex] = {
        ...(toasts.value[existingIndex] as Toast),
        ...body,
        _duplicate: ((toasts.value[existingIndex] as Toast)._duplicate || 0) + 1,
      }
      triggerRef(toasts)

      return body
    }

    queue.push(body)
    processQueue()

    return body
  }

  function update(id: string | number, toast: Omit<Partial<Toast>, 'id'>) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    if (index !== -1) {
      toasts.value[index] = {
        ...(toasts.value[index] as Toast),
        ...toast,
        _updated: true,
        duration: toast.duration,
        open: true,
      }
      triggerRef(toasts)

      nextTick(() => {
        const i = toasts.value.findIndex((t: Toast) => t.id === id)
        if (i !== -1 && toasts.value[i]!._updated) {
          toasts.value[i] = {
            ...(toasts.value[i] as Toast),
            _updated: undefined,
          }
          triggerRef(toasts)
        }
      })
    }
  }

  function remove(id: string | number) {
    const index = toasts.value.findIndex((t: Toast) => t.id === id)
    if (index !== -1 && toasts.value[index]!._updated) {
      return
    }

    if (index !== -1) {
      toasts.value[index] = {
        ...(toasts.value[index] as Toast),
        open: false,
      }
      triggerRef(toasts)

      setTimeout(() => {
        toasts.value = toasts.value.filter((t: Toast) => t.id !== id)
      }, TOAST_EXIT_MS)

      return
    }

    toasts.value = toasts.value.filter((t: Toast) => t.id !== id)
  }

  function clear() {
    toasts.value = []
  }

  return {
    add,
    clear,
    remove,
    toasts,
    update,
  }
}
