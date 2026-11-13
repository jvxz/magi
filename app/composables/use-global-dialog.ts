import type { Room, RoomMember } from 'matrix-js-sdk'

export interface GlobalDialogMap {
  invite: { room: string }
  leave: {
    room: Room
  }
  image:
    | { alt: string; type: 'room'; room: MaybeRoomOrId }
    | { alt: string; type: 'user'; user: MaybeUserOrId }
    | { alt: string; type: 'roomMember'; room: MaybeRoomOrId; member: RoomMember | string }
    | { alt: string; type: 'image'; url: string; blurhash?: string }
  codeViewer: {
    code: string
    lang?: string
  }
  deleteMessage: {
    roomId: string
    eventId: string
  }
  text: {
    title: string
    text: string
  }
  roomSettings: {
    room: Room
  }
  editAvatar: {
    /**
     * @param avatarUrl undefined if deletion request, string as mxc URL if uploaded
     * @param file undefined if delection request
     */
    onAction: (avatarUrl: string | undefined, file: File | undefined) => void
  }
}
export type GlobalDialog = keyof GlobalDialogMap

type GlobalDialogEntry = {
  [K in GlobalDialog]: { name: K; id: number; open: boolean } & GlobalDialogMap[K]
}[GlobalDialog]

export const useGlobalDialog = createGlobalState(() => {
  const stack = ref<GlobalDialogEntry[]>([])
  let nextId = 0

  const openDialog = <T extends GlobalDialog>(name: T, payload: GlobalDialogMap[T]) => {
    // only drop dialogs that have finished closing to retain exit animation
    stack.value = stack.value.filter(d => d.open)
    stack.value.push({ id: nextId++, name, open: true, ...payload } as GlobalDialogEntry)
  }

  return { openDialog, stack }
})
