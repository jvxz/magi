import type { ClientEventHandlerMap, EmittedEvents, Listener, MatrixClient } from 'matrix-js-sdk'
import { ClientEvent, RoomMemberEvent } from 'matrix-js-sdk'

type ValidEvents = EmittedEvents | RoomMemberEvent

type EmitterListener<T extends ValidEvents = ValidEvents> = Listener<ValidEvents, ClientEventHandlerMap, T>

const syncHook = createEventHook<Parameters<EmitterListener<ClientEvent.Sync>>>()
export const roomMemberTypingHook = createEventHook<Parameters<EmitterListener<RoomMemberEvent.Typing>>>()

export const useMatrixHooks = createSharedComposable(() => {
  const { client } = useMatrixClient()

  watch(client, (current, prev) => {
    bindListener(ClientEvent.Sync, syncHook.trigger, { current, prev })
    bindListener(RoomMemberEvent.Typing, roomMemberTypingHook.trigger, { current, prev })
  }, { immediate: true })

  return {
    onSync: syncHook.on,
  }
})

function bindListener<T extends ValidEvents>(event: T, listener: EmitterListener<T>, clients: { current: MatrixClient, prev: MatrixClient | undefined }) {
  clients.current.on<T>(event, listener)

  if (clients.prev)
    clients.prev.off<T>(event, listener)
}
