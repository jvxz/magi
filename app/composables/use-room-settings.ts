import type { StateEvents } from 'matrix-js-sdk'
import type { Room } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'
import { isEqual } from 'es-toolkit'

export function useRoomSettings(roomInput: MaybeRefOrGetter<Room>) {
  const room = toRef(roomInput)

  const { client } = useMatrixClient()
  const currentRoomSettings = useRoomComputed(room, getRoomSettings)

  const { self } = useSelf()
  const permissions = useRoomMemberPermissions(room, () => self.value?.userId)

  const setSetting = async <TKey extends keyof RoomSettings>(key: TKey, content: StateEvents[TKey]) => {
    const current = currentRoomSettings.value

    const isSettingEqual = isEqual(current[key], content)
    const isAllowed = permissions.canSendStateEvent(key)
    if (!isSettingEqual && isAllowed) {
      await client.value.sendStateEvent(room.value.roomId, key, content)
    }
  }
  const setSettings = async (newSettings: RoomSettings) => {
    await Promise.all(MATRIX__CONFIGURABLE_ROOM_SETTINGS.map(key => setSetting(key, newSettings[key])))
  }

  return {
    currentRoomSettings,
    setSetting,
    setSettings,
  }
}
