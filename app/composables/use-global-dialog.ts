import type { Room, RoomMember, ImageContent } from 'matrix-js-sdk'

export interface GlobalDialogMap {
  invite: { room: string }
  leave: {
    room: Room
  }
  image:
    | { alt: string; type: 'room'; room: MaybeRoomOrId }
    | { alt: string; type: 'user'; user: MaybeUserOrId }
    | { alt: string; type: 'roomMember'; room: MaybeRoomOrId; member: RoomMember | string }
    | { alt: string; type: 'image'; content: ImageContent }
  codeViewer: {
    code: string
    lang?: string
  }
  deleteMessage: {
    roomId: string
    eventId: string
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
  const open = ref(false)
  const state = shallowRef<GlobalDialogState>()
  const dialogKey = ref(0)

  const openDialog = <T extends GlobalDialog>(name: T, payload: GlobalDialogMap[T]) => {
    state.value = { name, ...payload } as GlobalDialogState
    dialogKey.value++
    open.value = true
  }

  return { dialogKey, open, openDialog, state }
})
