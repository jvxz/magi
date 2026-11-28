import type { MatrixEvent, Room } from 'matrix-js-sdk'

export interface ImagePack extends ImagePackMeta {
  id: string
  roomId: string | undefined
  creator: string | undefined
  createdAt: number
  images: Record<string, ImagePackImage>
}

export function getRoomImagePacks(room: Room) {
  return getStateEvents(room, CustomEventType.PoniesRoomEmotes as any)
}

export function getRoomImagePack(room: Room, packStateKey: string) {
  const event = getRoomImagePacks(room)
  return event.find(e => e.getStateKey() === packStateKey)
}

export function getImagePackId(roomId: string, stateKey: string) {
  return `${roomId}/${stateKey}`
}

export function formatImagePack(event: MatrixEvent | undefined): ImagePack | undefined {
  if (
    !event ||
    !([CustomEventType.PoniesRoomEmotes, AccountDataEvent.PoniesUserEmotes] as any[]).includes(event.getType())
  )
    return

  const { images, pack } = event.getContent<ImagePackContent>()
  const roomId = event.getRoomId()
  const id = roomId ? getImagePackId(roomId, event.getStateKey() ?? '') : 'user'

  return {
    ...pack,
    createdAt: event.getTs(),
    creator: event.getSender(),
    id,
    images: images ?? {},
    roomId: event.getRoomId(),
  }
}
