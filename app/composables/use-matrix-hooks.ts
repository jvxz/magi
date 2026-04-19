import type { ClientEventHandlerMap, EmittedEvents, Listener, MatrixClient } from 'matrix-js-sdk'
import { ClientEvent, MatrixEventEvent, RoomMemberEvent } from 'matrix-js-sdk'

type ValidEvents = EmittedEvents | RoomMemberEvent

type EmitterListener<T extends ValidEvents = ValidEvents> = Listener<ValidEvents, ClientEventHandlerMap, T>

const syncHook = createEventHook<Parameters<EmitterListener<ClientEvent.Sync>>>()
const decryptedHook = createEventHook<Parameters<EmitterListener<MatrixEventEvent.Decrypted>>>()
const eventHook = createEventHook<Parameters<EmitterListener<ClientEvent.Event>>>()
export const roomMemberTypingHook = createEventHook<Parameters<EmitterListener<RoomMemberEvent.Typing>>>()

export const useMatrixHooks = createSharedComposable(() => {
  const { client } = useMatrixClient()

  watch(client, (current, prev) => {
    bindListener(ClientEvent.Sync, syncHook.trigger, { current, prev })
    bindListener(ClientEvent.Event, eventHook.trigger, { current, prev })
    bindListener(RoomMemberEvent.Typing, roomMemberTypingHook.trigger, { current, prev })
    bindListener(MatrixEventEvent.Decrypted, decryptedHook.trigger, { current, prev })
  }, { immediate: true })

  return {
    onDecrypted: decryptedHook.on,
    onEvent: eventHook.on,
    onSync: syncHook.on,
  }
})

function bindListener<T extends ValidEvents>(event: T, listener: EmitterListener<T>, clients: { current: MatrixClient, prev: MatrixClient | undefined }) {
  clients.current.on<T>(event, listener)

  if (clients.prev)
    clients.prev.off<T>(event, listener)
}
