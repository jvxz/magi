interface AppNotificationOptions {
  emitToast?: boolean
  persist?: boolean
  variant?: AlertVariants
}

export const useNotifications = createSharedComposable(() => {
  const notificationsMap = useScopedLocalStorage<Map<AppNotification['id'], AppNotification>>('notis', new Map(), {
    shallow: true,
  })
  const toast = useToast()

  const notify = <T extends AppNotificationName>(
    key: T,
    notification: Omit<AppNotification<T>, 'key' | 'id' | 'timestamp'> & { id?: string },
    opts?: Partial<AppNotificationOptions>,
  ) => {
    const { emitToast = true, persist = true } = opts ?? {}

    const id = notification.id ?? crypto.randomUUID()
    if (persist) {
      notificationsMap.value.set(id, {
        ...notification,
        id,
        key,
        timestamp: Temporal.Now.instant().epochMilliseconds,
      })
      triggerRef(notificationsMap)
    }

    if (emitToast) {
      toast.add({ ...notification, id, key, variant: opts?.variant })
    }
  }

  const notifyError = (error: Error | ErrorShape, title: string) => {
    const shape = isError(error) ? parseError(error) : error
    notify(
      'error',
      {
        payload: {
          description: `${shape.title}: ${shape.message}`,
          raw: shape.raw,
          title,
        },
      },
      {
        persist: false,
        variant: 'danger',
      },
    )
  }

  const dismiss = (id: AppNotification['id']) => {
    const noti = notificationsMap.value.get(id)
    if (!noti) return

    notificationsMap.value.delete(id)
    triggerRef(notificationsMap)
  }

  const dismissAll = () => (notificationsMap.value = new Map())

  const notifications = computed(() => [...notificationsMap.value.values()])

  return {
    dismiss,
    dismissAll,
    notifications,
    notificationsMap,
    notify,
    notifyError,
  }
})

export function isNotificationType<T extends AppNotificationName>(
  notification: AppNotification,
  key: T,
): notification is AppNotification<T> {
  return notification.key === key
}
