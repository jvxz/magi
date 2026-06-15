import type { MatrixEvent, RoomMember } from 'matrix-js-sdk'

export interface ContextMenuRegions {
  member: {
    member: RoomMember | undefined
    roomId: string
  }
  event: {
    event: MatrixEvent
    roomId: string
  }
}

export type ContextMenuName = keyof ContextMenuRegions
