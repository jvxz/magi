import type { ICreateRoomOpts, MatrixError } from 'matrix-js-sdk'

export const useClientActions = () => {
  const { client } = useMatrixClient()
  const { notifyError, notify } = useNotifications()
  const { authMetadata } = useAuthMetadata()
  const { attemptAction } = useInteractiveAuth()

  const createRoom = useMutation({
    mutationFn: (opts: ICreateRoomOpts) => client.value.createRoom(opts),
    mutationKey: $mk.createRoom(),
    onError: err => notifyError(err, 'Failed to create chat'),
  })

  const deleteDevice = useMutation({
    mutationFn: async ({ deviceId }: { deviceId: string | undefined }) => {
      if (!deviceId) return

      // await attemptAction(authDict => client.value.deleteDevice(deviceId, authDict ?? undefined))

      const [err] = await attemptAsync<unknown, MatrixError | UIALegacyUnsupportedError | unknown>(() =>
        attemptAction(authDict => client.value.deleteDevice(deviceId, authDict ?? undefined)),
      )

      if (err instanceof UIALegacyUnsupportedError && authMetadata.value?.account_management_uri) {
        const url = new URL(authMetadata.value.account_management_uri)
        url.searchParams.set('action', 'session_end')
        url.searchParams.set('device_id', deviceId)
        await navigateTo(url.href, { external: true, open: { target: '_blank' } })
      } else throw err

      return true
    },
    mutationKey: $mk.deleteDevice(),
    onSuccess: (res, { deviceId }) => {
      if (res) return

      notify('generic', {
        payload: {
          description: `Device ID ${deviceId}'s authentication was removed`,
          title: 'Removed device',
        },
      })
    },
  })

  return { createRoom, deleteDevice }
}
