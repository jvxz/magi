export interface AppNotification extends Pick<Toast, 'title' | 'description' | 'actions' | 'icon' | 'variant'> {
  id: string
  timestamp: number
}

interface AppNotificationOptions {
  emitToast?: boolean
  persist?: boolean
}

export const useNotifications = createSharedComposable(() => {
  const notificationsMap = useScopedLocalStorage<Map<AppNotification['id'], AppNotification>>('notis', new Map(), {
    shallow: true,
  })
  const toast = useToast()

  const notify = (notification: Omit<AppNotification, 'id' | 'timestamp'>, opts?: Partial<AppNotificationOptions>) => {
    const { emitToast = true, persist = true } = opts ?? {}

    if (persist) {
      const id = crypto.randomUUID()
      notificationsMap.value.set(id, { ...notification, id, timestamp: Temporal.Now.instant().epochMilliseconds })
      triggerRef(notificationsMap)
    }

    if (emitToast) {
      toast.add(notification)
    }
  }

  const dismiss = (id: AppNotification['id']) => {
    notificationsMap.value.delete(id)
    triggerRef(notificationsMap)
  }

  const dismissAll = () => (notificationsMap.value = new Map())

  const notifications = computed(() => [...notificationsMap.value.values()])

  return {
    dismiss,
    dismissAll,
    notifications,
    notify,
  }
})
