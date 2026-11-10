import type { Room } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'
import { isEqual } from 'es-toolkit'

type ExtraKey = Exclude<keyof RoomSettings, keyof StateRoomSettings>

export function useRoomSettings(roomInput: MaybeRefOrGetter<Room>) {
  const room = toRef(roomInput)
  const { client } = useMatrixClient()
  const { self } = useSelf()
  const qc = useQueryClient()

  const permissions = useRoomMemberPermissions(room, () => self.value?.userId)

  const stateSettings = useRoomComputed(room, getRoomSettings)
  const directoryVisibility = useRoomDirectoryVisibility(room)

  const currentRoomSettings = computed<RoomSettings>(() => ({
    ...stateSettings.value,
    directoryVisibility: directoryVisibility.data.value,
  }))

  const extraWriters: { [K in ExtraKey]: (value: RoomSettings[K]) => Promise<unknown> | void } = {
    directoryVisibility: async value => {
      const res = permissions.canEditDirectoryVisibility.value
        ? await client.value.setRoomDirectoryVisibility(room.value.roomId, value)
        : undefined

      qc.setQueryData($qk.roomDirectoryVisibility(room.value.roomId), value)

      return res
    },
  }
  const isExtraKey = (key: keyof RoomSettings): key is ExtraKey => key in extraWriters

  const setSetting = <K extends keyof RoomSettings>(key: K, value: RoomSettings[K]) => {
    if (isExtraKey(key)) return extraWriters[key](value as never)
    if (permissions.canSendStateEvent(key)) return client.value.sendStateEvent(room.value.roomId, key, value as never)
  }

  const setSettings = useMutation({
    mutationFn: (draft: RoomSettings) => {
      const current = currentRoomSettings.value
      return Promise.all(
        objectKeys(draft)
          .filter(key => !isEqual(draft[key], current[key]))
          .map(key => setSetting(key, draft[key])),
      )
    },
    mutationKey: $mk.setRoomSettings(() => room.value.roomId),
  })

  return {
    currentRoomSettings,
    setSetting,
    setSettings,
  }
}
