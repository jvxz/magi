export interface TooltipRegions {
  timestamp: {
    datetime: string | number
  }
  deviceListVerifiedIcon: {
    verified: boolean | undefined
  }
  lobbyRoomCard: string
}

export type TooltipName = keyof TooltipRegions
