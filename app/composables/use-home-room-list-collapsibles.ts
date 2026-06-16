export const useHomeRoomListCollapsibles = () =>
  useScopedLocalStorage<{ recents: boolean; pinned: boolean }>('homeRoomListCollapsibles', {
    pinned: false,
    recents: true,
  })
