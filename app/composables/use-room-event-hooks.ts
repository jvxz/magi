import type { Listener, MatrixEvent, MatrixEventEmittedEvents, MatrixEventHandlerMap } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'
import { MatrixEventEvent } from 'matrix-js-sdk'

type EmitterListener<T extends MatrixEventEmittedEvents> = Listener<MatrixEventEmittedEvents, MatrixEventHandlerMap, T>

type Params = Partial<{
  onRelationsCreated: EmitterListener<MatrixEventEvent.RelationsCreated>
}>

export function useRoomEventHooks(event: MaybeRefOrGetter<MatrixEvent | undefined>, params?: Params) {
  const eventRef = toRef(event)

  const disposers: (() => void)[] = []
  const cleanup = () => disposers.forEach(disposer => disposer())

  watch(
    eventRef,
    event => {
      cleanup()

      bindListener(MatrixEventEvent.RelationsCreated, params?.onRelationsCreated, disposers, event)
    },
    { immediate: true },
  )

  onScopeDispose(cleanup)
}

function bindListener<T extends MatrixEventEmittedEvents>(
  eventType: T,
  listener: EmitterListener<T> | undefined,
  disposers: (() => void)[],
  event: MatrixEvent | undefined,
) {
  if (!event || !listener) return

  event.on<T>(eventType, listener)

  disposers.push(() => {
    if (event) event.off<T>(eventType, listener)
  })
}
