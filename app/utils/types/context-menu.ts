import type { MatrixEvent, Room, RoomMember } from 'matrix-js-sdk'

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
  directRoom: {
    roomId: string
  }
  invite: {
    roomId: string
  }
  asideRoom: {
    room: Room
  }
}

export type ContextMenuName = keyof ContextMenuRegions
