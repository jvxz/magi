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
    room:
      | {
          kind: 'direct'
          roomId: string
          spaceId?: never
        }
      | {
          kind: 'group'
          roomId: string
          spaceId: string
        }
    type: 'recent' | 'pinned'
  }
}

export type ContextMenuName = keyof ContextMenuRegions
