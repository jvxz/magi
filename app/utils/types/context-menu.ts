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
  homeRoom: {
    roomId: string
    spaceId: string
    type: 'recent' | 'pinned'
  }
}

export type ContextMenuName = keyof ContextMenuRegions
