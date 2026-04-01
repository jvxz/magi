import type { Room } from 'matrix-js-sdk'

export function onRoomChange(cb: (value: Room | undefined, prev: Room | undefined) => void) {
  const { client } = useMatrixClient()
  const router = useRouter()

  const cleanup = router.afterEach((to, from) => {
    if (to.path === from.path)
      return

    const value = 'roomId' in to.params ? client.value.getRoom(to.params.roomId) ?? undefined : undefined
    const prev = 'roomId' in from.params ? client.value.getRoom(from.params.roomId) ?? undefined : undefined
    cb(value, prev)
  })

  onScopeDispose(cleanup)
}
