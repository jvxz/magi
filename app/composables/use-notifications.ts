export interface Notification extends Pick<Toast, 'title' | 'description' | 'actions' | 'icon' | 'variant'> {
  id: string
}

interface NotificationOptions {
  emitToast?: boolean
  persist?: boolean
}

export const useNotifications = createSharedComposable(() => {
  const notificationsMap = useScopedLocalStorage<Map<Notification['id'], Notification>>('notis', new Map(), {
    shallow: true,
  })
  const toast = useToast()

  const notify = (notification: Omit<Notification, 'id'>, opts?: Partial<NotificationOptions>) => {
    const { emitToast = true, persist = true } = opts ?? {}

    if (persist) {
      const id = crypto.randomUUID()
      notificationsMap.value.set(id, { ...notification, id })
      triggerRef(notificationsMap)
    }

    if (emitToast) {
      toast.add(notification)
    }
  }

  const dismiss = (id: Notification['id']) => {
    notificationsMap.value.delete(id)
    triggerRef(notificationsMap)
  }

  const notifications = computed(() => [...notificationsMap.value.values()])

  return {
    dismiss,
    notifications,
    notify,
  }
})
