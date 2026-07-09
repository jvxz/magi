import type { ICreateRoomOpts } from 'matrix-js-sdk'

export function useClientActions() {
  const { client } = useMatrixClient()
  const { notifyError } = useNotifications()

  const createRoom = useMutation({
    mutationFn: (opts: ICreateRoomOpts) => client.value.createRoom(opts),
    mutationKey: ['createRoom'],
    onError: err => notifyError(err, 'Failed to create chat'),
  })

  return { createRoom }
}
