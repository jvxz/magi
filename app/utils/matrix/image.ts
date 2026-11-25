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

export function formatImagePack(event: MatrixEvent | undefined, id = event?.getStateKey()): ImagePack | undefined {
  if (
    !event ||
    id === undefined ||
    !([CustomEventType.PoniesRoomEmotes, AccountDataEvent.PoniesUserEmotes] as any[]).includes(event.getType())
  )
    return

  const { images, pack } = event.getContent<ImagePackContent>()

  return {
    ...pack,
    createdAt: event.getTs(),
    creator: event.getSender(),
    id,
    images: images ?? {},
    roomId: event.getRoomId(),
  }
}

export function formatImagePacks(events: MatrixEvent[]) {
  const packs = new Map<string, ImagePack>()
  for (const event of events) {
    const pack = formatImagePack(event)
    if (pack) packs.set(pack.id, pack)
  }

  return packs
}
