import type { Room } from 'matrix-js-sdk'

export interface GlobalDialogMap {
  invite: ContextMenuRegions['invite']
  leave: {
    room: Room
  }
}
export type GlobalDialog = keyof GlobalDialogMap

type GlobalDialogState = Prettify<
  {
    [K in GlobalDialog]: {
      name: K
    } & GlobalDialogMap[K]
  }[GlobalDialog]
>

export const useGlobalDialog = createGlobalState(() => {
  const open = shallowRef(false)
  const state = shallowRef<GlobalDialogState>()

  const openDialog = <T extends GlobalDialog>(name: T, payload: GlobalDialogMap[T]) => {
    state.value = { name, ...payload } as GlobalDialogState
    open.value = true
  }

  whenever(
    () => !open.value,
    () => (state.value = undefined),
  )

  return { open, openDialog, state }
})
