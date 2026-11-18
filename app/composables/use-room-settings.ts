import type { Room } from 'matrix-js-sdk'

import { toRef } from '@vueuse/core'
import { isEqual, toMerged } from 'es-toolkit'
import { EventType, HistoryVisibility } from 'matrix-js-sdk'

type ExtraKey = Exclude<keyof RoomSettings, keyof StateRoomSettings>

export function useRoomSettings(roomInput: MaybeRefOrGetter<Room>) {
  const room = toRef(roomInput)
  const { client } = useMatrixClient()
  const { self } = useSelf()
  const qc = useQueryClient()

  const permissions = useRoomMemberPermissions(room, () => self.value?.userId)

  const stateSettings = useRoomComputed(room, getRoomSettings)
  const directoryVisibility = useRoomDirectoryVisibility(room)
  const { localAliases } = useRoomAliases(room)

  const currentRoomSettings = computed<RoomSettings>(() => {
    const pl = stateSettings.value[EventType.RoomPowerLevels]
    const stateDefault = pl.state_default ?? MATRIX__DEFAULT_POWER_LEVELS.state_default
    const defaults = {
      ...MATRIX__DEFAULT_POWER_LEVELS,
      events: objectFromEntries(MATRIX__POWER_LEVEL_EDITABLE_EVENTS.map(type => [type, stateDefault])),
    }

    return {
      ...stateSettings.value,
      // apply default power levels. defaults get set when saving
      [EventType.RoomPowerLevels]: toMerged(defaults, pl),
      [EventType.RoomHistoryVisibility]: {
        ...stateSettings.value[EventType.RoomHistoryVisibility],
        history_visibility:
          stateSettings.value[EventType.RoomHistoryVisibility].history_visibility ?? HistoryVisibility.Shared,
      },
      directoryVisibility: directoryVisibility.data.value,
      localAliases: localAliases.value,
    }
  })

  const extraWriters: { [K in ExtraKey]: (value: RoomSettings[K]) => Promise<unknown> | void } = {
    directoryVisibility: async value => {
      if (!permissions.canEditDirectoryVisibility.value) return

      await client.value.setRoomDirectoryVisibility(room.value.roomId, value)
      qc.setQueryData($qk.roomDirectoryVisibility(room.value.roomId), value)
    },
    localAliases: async value => {
      if (!permissions.canEditCanonicalAlias.value) return

      const current = currentRoomSettings.value.localAliases

      try {
        for (const alias of xor(value, current)) {
          if (current.includes(alias)) await client.value.deleteAlias(alias)
          else await client.value.createAlias(alias, room.value.roomId)
        }
      } finally {
        await qc.refetchQueries({
          queryKey: $qk.roomLocalAliases(room.value.roomId),
        })
      }
    },
  }
  const isExtraKey = (key: keyof RoomSettings): key is ExtraKey => key in extraWriters

  const setSetting = <K extends keyof RoomSettings>(key: K, value: RoomSettings[K]) => {
    if (isExtraKey(key)) return extraWriters[key](value as never)
    if (!permissions.canSendStateEvent(key)) throw new PermissionError(`Missing permission to change ${key}`)
    return client.value.sendStateEvent(room.value.roomId, key, value as never)
  }

  const setSettings = useMutation({
    mutationFn: async (draft: RoomSettings) => {
      const current = currentRoomSettings.value
      const changed = objectKeys(draft).filter(key => !isEqual(draft[key], current[key]))

      const [extras, state] = partition(changed, isExtraKey)
      await Promise.all(extras.map(key => setSetting(key, draft[key])))
      return Promise.all(state.map(key => setSetting(key, draft[key])))
    },
    mutationKey: $mk.setRoomSettings(() => room.value.roomId),
  })

  return {
    currentRoomSettings,
    setSetting,
    setSettings,
  }
}
