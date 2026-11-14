<script lang="ts" setup>
import { EventType } from 'matrix-js-sdk'

import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { unsavedChanges, isEdited, isSpace, permissions } = injectRoomSettingsDialogContext()

type PlKey = keyof Omit<RoomSettings['m.room.power_levels'], 'events' | 'notifications' | 'users'>
type Scope = 'space' | 'room'

const isPowerLevelEdited = (select: (s: globalThis.RoomSettings) => unknown) => computed(() => isEdited(select))

const plItem = (key: PlKey, label: string, defaultValue: number, specificTo?: Scope) => ({
  edited: isPowerLevelEdited(s => s['m.room.power_levels'][key]),
  key,
  label,
  ref: computed({
    get: () => unsavedChanges.value['m.room.power_levels'][key] ?? defaultValue,
    set: (nextValue: number | undefined) => {
      if (isDefined(nextValue)) unsavedChanges.value['m.room.power_levels'][key] = nextValue
    },
  }),
  specificTo,
})

const plEventItem = (key: EventType, label: string, defaultValue: number, specificTo?: Scope) => ({
  edited: isPowerLevelEdited(s => s['m.room.power_levels'].events[key]),
  isEventType: true as const,
  key,
  label,
  ref: computed({
    get: () => unsavedChanges.value['m.room.power_levels'].events[key] ?? defaultValue,
    set: (nextValue: number | undefined) => {
      if (isDefined(nextValue)) unsavedChanges.value['m.room.power_levels'].events[key] = nextValue
    },
  }),
  specificTo,
})

const shouldShow = <T extends { specificTo?: Scope }>(groupOrItem: T) =>
  groupOrItem.specificTo
    ? (groupOrItem.specificTo === 'space' && isSpace.value) || (groupOrItem.specificTo === 'room' && !isSpace.value)
    : true

const groupMap: {
  items: {
    key: string
    label: string
    ref: globalThis.WritableComputedRef<number, number | undefined>
    isEventType?: true
    specificTo?: Scope
    edited: ComputedRef<boolean>
  }[]
  key: string
  label: string
  specificTo?: Scope
}[] = [
  {
    items: [plEventItem(EventType.SpaceChild, 'Manage space children', MATRIX__DEFAULT_POWER_LEVELS.state_default)],
    key: 'users',
    label: 'Users',
  },
  {
    items: [
      plItem('invite', 'Invite users', PowerLevelByName.Member),
      plItem('kick', 'Kick users', PowerLevelByName.Moderator),
      plItem('ban', 'Ban users', PowerLevelByName.Moderator),
    ],
    key: 'moderation',
    label: 'Moderation',
  },
  {
    items: [
      plEventItem(EventType.RoomAvatar, 'Edit avatar', PowerLevelByName.Moderator),
      plEventItem(EventType.RoomName, 'Change name', PowerLevelByName.Moderator),
      plEventItem(EventType.RoomTopic, 'Edit topic', PowerLevelByName.Moderator),
    ],
    key: 'profile',
    label: 'Space profile',
  },
  {
    items: [
      plEventItem(EventType.RoomJoinRules, 'Change member access', PowerLevelByName.Moderator),
      plEventItem(EventType.RoomHistoryVisibility, 'Change history visibility', PowerLevelByName.Moderator),
      plEventItem(EventType.RoomCanonicalAlias, 'Edit room alias', PowerLevelByName.Moderator),
      plEventItem(EventType.RoomPowerLevels, 'Change power levels', PowerLevelByName.Admin),
      plEventItem(EventType.RoomTombstone, 'Upgrade room', PowerLevelByName.Admin),
    ],
    key: 'space-settings',
    label: 'Space settings',
  },
] as const
</script>

<template>
  <template v-for="group in groupMap" :key="group.key">
    <USettingGroupRoot v-if="shouldShow(group)">
      <USettingGroupHeader>
        <USettingGroupTitle> {{ group.label }} </USettingGroupTitle>
      </USettingGroupHeader>

      <USettingGroupContent variant="raised" as-child>
        <UTableRoot>
          <UTableBody>
            <template v-for="item in group.items" :key="item.key">
              <UTableRow v-if="shouldShow(item)" :divide="false">
                <UTableRowCell class="p-4 w-full space-x-2">
                  <span class="font-medium">{{ item.label }}</span>
                  <span v-if="item.isEventType" class="text-xs text-muted-foreground">({{ item.key }})</span>
                </UTableRowCell>
                <UTableRowCell>
                  <UChip :show="item.edited.value">
                    <UNumberField
                      v-model:model-value="item.ref.value"
                      :disabled="!permissions.canEditPowerLevels.value"
                      variant="top"
                      class="w-36"
                    />
                  </UChip>
                </UTableRowCell>
              </UTableRow>
            </template>
          </UTableBody>
        </UTableRoot>
      </USettingGroupContent>
    </USettingGroupRoot>
  </template>
</template>
