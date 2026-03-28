import type { ClientEventHandlerMap, EmittedEvents, Listener, MatrixClient } from 'matrix-js-sdk'
import { ClientEvent } from 'matrix-js-sdk'

type EmitterListener<T extends EmittedEvents = EmittedEvents> = Listener<EmittedEvents, ClientEventHandlerMap, T>
type EmitterListenerParams<T extends EmittedEvents = EmittedEvents> = Parameters<EmitterListener<T>>

const syncHook = createEventHook<EmitterListenerParams<ClientEvent.Sync>>()

export const useMatrixHooks = createSharedComposable(() => {
  const { client } = useMatrixClient()

  watch(client, (current, prev) => {
    createListener(ClientEvent.Sync, syncHook.trigger, { current, prev })
  }, { immediate: true })

  return {
    onSync: syncHook.on,
  }
})

function createListener<T extends EmittedEvents>(event: T, listener: EmitterListener<T>, clients: { current: MatrixClient, prev: MatrixClient | undefined }) {
  clients.current.on<T>(event, listener)

  if (clients.prev)
    clients.prev.off<T>(event, listener)
}
