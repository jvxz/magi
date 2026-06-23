import { ClientEvent } from 'matrix-js-sdk'

export default defineNuxtPlugin(() => {
  if (!import.meta.dev) return
  const mx = useMatrixClient()

  const log: any[] = []
  const MAX = 2000

  let off: (() => void) | undefined
  watch(
    mx.client,
    c => {
      off?.()
      const handler = (event: any) => {
        log.push({
          event: event.event,
          room: event.getRoomId(),
          sender: event.getSender(),
          t: Date.now(),
          type: event.getType(),
        })
        if (log.length > MAX) log.shift()
      }
      c.on(ClientEvent.Event, handler)
      off = () => c.off(ClientEvent.Event, handler)
    },
    { immediate: true },
  )

  ;(window as any).__magi = {
    ...mx,
    clear: () => (log.length = 0),
    dump: (type?: string) =>
      // oxlint-disable-next-line no-console
      console.table(
        (type ? log.filter(e => e.type === type) : log).map(({ room, sender, t, type }) => ({
          room,
          sender,
          time: new Date(t),
          type,
        })),
      ),
    log,
    since: (ms: number) => log.filter(e => e.t > Date.now() - ms),
  }
})
