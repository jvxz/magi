import type { ICreateRoomOpts } from 'matrix-js-sdk'

export function useClientActions() {
  const { client } = useMatrixClient()

  const createRoom = useMutation({
    mutationFn: (opts: ICreateRoomOpts) => client.value.createRoom(opts),
    mutationKey: $mk.createRoom(),
  })

  return { createRoom }
}
