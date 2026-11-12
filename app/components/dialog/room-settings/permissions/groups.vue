<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { unsavedChanges, isEdited } = injectRoomSettingsDialogContext()

const plRef = (
  key: keyof Omit<RoomSettings['m.room.power_levels'], 'events' | 'notifications' | 'users'>,
  defaultValue: number,
) =>
  computed({
    get: () => unsavedChanges.value['m.room.power_levels'][key] ?? defaultValue,
    set: (nextValue: number | undefined) => {
      if (isDefined(nextValue)) unsavedChanges.value['m.room.power_levels'][key] = nextValue
    },
  })

const plEventRef = (key: EventType, defaultValue: number) =>
  computed({
    get: () => unsavedChanges.value['m.room.power_levels'].events[key] ?? defaultValue,
    set: (nextValue: number | undefined) => {
      if (isDefined(nextValue)) unsavedChanges.value['m.room.power_levels'].events[key] = nextValue
    },
  })

const isPowerLevelEdited = (select: (s: globalThis.RoomSettings) => unknown) => computed(() => isEdited(select))

const groupMap: {
  items: {
    key: string
    label: string
    ref: globalThis.WritableComputedRef<number, number | undefined>
    isEventType?: true
    edited: ComputedRef<boolean>
  }[]
  key: string
  label: string
}[] = [
  {
    items: [
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.SpaceChild]),
        isEventType: true,
        key: EventType.SpaceChild,
        label: 'Manage space children',
        ref: plEventRef(EventType.SpaceChild, MATRIX__DEFAULT_POWER_LEVELS.state_default),
      },
    ],
    key: 'users',
    label: 'Users',
  },
  {
    items: [
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].invite),
        key: 'invite',
        label: 'Invite users',
        ref: plRef('invite', PowerLevelByName.Member),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].kick),
        key: 'kick',
        label: 'Kick users',
        ref: plRef('kick', PowerLevelByName.Moderator),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].ban),
        key: 'ban',
        label: 'Ban users',
        ref: plRef('ban', PowerLevelByName.Moderator),
      },
    ],
    key: 'moderation',
    label: 'Moderation',
  },
  {
    items: [
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomAvatar]),
        isEventType: true,
        key: EventType.RoomAvatar,
        label: 'Edit avatar',
        ref: plEventRef(EventType.RoomAvatar, PowerLevelByName.Moderator),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomName]),
        isEventType: true,
        key: EventType.RoomName,
        label: 'Change name',
        ref: plEventRef(EventType.RoomName, PowerLevelByName.Moderator),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomTopic]),
        isEventType: true,
        key: EventType.RoomTopic,
        label: 'Edit topic',
        ref: plEventRef(EventType.RoomTopic, PowerLevelByName.Moderator),
      },
    ],
    key: 'space-profile',
    label: 'Space profile',
  },
  {
    items: [
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomJoinRules]),
        isEventType: true,
        key: EventType.RoomJoinRules,
        label: 'Change member access',
        ref: plEventRef(EventType.RoomJoinRules, PowerLevelByName.Moderator),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomCanonicalAlias]),
        isEventType: true,
        key: EventType.RoomCanonicalAlias,
        label: 'Edit room alias',
        ref: plEventRef(EventType.RoomCanonicalAlias, PowerLevelByName.Moderator),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomPowerLevels]),
        isEventType: true,
        key: EventType.RoomPowerLevels,
        label: 'Change power levels',
        ref: plEventRef(EventType.RoomPowerLevels, PowerLevelByName.Admin),
      },
      {
        edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[EventType.RoomTombstone]),
        isEventType: true,
        key: EventType.RoomTombstone,
        label: 'Upgrade room',
        ref: plEventRef(EventType.RoomTombstone, PowerLevelByName.Admin),
      },
    ],
    key: 'space-settings',
    label: 'Space settings',
  },
]
</script>

<template>
  <USettingGroupRoot v-for="group in groupMap" :key="group.key">
    <USettingGroupHeader>
      <USettingGroupTitle> {{ group.label }} </USettingGroupTitle>
    </USettingGroupHeader>

    <USettingGroupContent variant="raised" as-child>
      <UTableRoot>
        <UTableBody>
          <UTableRow v-for="item in group.items" :key="item.key" :divide="false">
            <UTableRowCell class="w-full p-4 space-x-2">
              <span class="font-medium">{{ item.label }}</span>
              <span v-if="item.isEventType" class="text-muted-foreground text-xs">({{ item.key }})</span>
            </UTableRowCell>
            <UTableRowCell>
              <UChip :show="item.edited.value">
                <UNumberField variant="top" v-model:model-value="item.ref.value" class="w-36" />
              </UChip>
            </UTableRowCell>
          </UTableRow>
        </UTableBody>
      </UTableRoot>
    </USettingGroupContent>
  </USettingGroupRoot>
</template>
