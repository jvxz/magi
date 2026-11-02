<script lang="ts">
import type { Room } from 'matrix-js-sdk'

import type { GlobalDialogMap } from '~/composables/use-global-dialog'

import { DialogRoomSettingsGeneral, DialogRoomSettingsMembers, DialogRoomSettingsPermissions } from '#components'

import type { SidebarLayoutGroupItem } from '../u/dialog/sidebar-layout-group-item.vue'

export type RoomSettingKey = (typeof roomSettings)[number]['key']
const roomSettings = [
  {
    icon: ICON__SETTINGS,
    key: 'General',
  },
  {
    icon: ICON__MEMBERS,
    key: 'Members',
  },
  {
    icon: ICON__PERMISSION,
    key: 'Permissions',
  },
] as const satisfies SidebarLayoutGroupItem[]

const roomSettingComponents = {
  General: DialogRoomSettingsGeneral,
  Members: DialogRoomSettingsMembers,
  Permissions: DialogRoomSettingsPermissions,
} as const satisfies Record<RoomSettingKey, Component>

export interface RoomSettingsDialogContext {
  room: Ref<Room>
  permissions: ReturnType<typeof useRoomMemberPermissions>
}

export const [injectRoomSettingsDialogContext, provideRoomSettingsDialogContext] =
  createContext<RoomSettingsDialogContext>('DialogRoomSettings')
</script>

<script lang="ts" setup>
const props = defineProps<GlobalDialogMap['roomSettings']>()
const room = toRef(props, 'room')

const selection = ref<RoomSettingKey>(roomSettings[0].key)

const { self } = useSelf()
const permissions = useRoomMemberPermissions(room, () => self.value?.userId)

provideRoomSettingsDialogContext({
  permissions,
  room,
})
</script>

<template>
  <UDialogRoot>
    <UDialogContent size="md" class="p-0 of-clip">
      <UDialogSidebarLayout>
        <template #sidebar>
          <div class="flex flex-col gap-2 size-full">
            <div class="flex items-center gap-2 p-1">
              <MatrixRoomAvatar :room square imageSize="small" class="size-1.5em rounded-sm" />
              <span class="font-medium">{{ resolveRoomName(room) }}</span>
            </div>

            <UDialogSidebarLayoutGroup v-model:model-value="selection" :default-value="roomSettings[0].key">
              <UDialogSidebarLayoutGroupItem v-for="setting in roomSettings" :key="setting.key" :value="setting.key">
                <Icon :name="setting.icon" />
                <span>{{ setting.key }}</span>
              </UDialogSidebarLayoutGroupItem>
            </UDialogSidebarLayoutGroup>
          </div>
        </template>

        <component v-if="selection" :is="roomSettingComponents[selection]" />
      </UDialogSidebarLayout>
    </UDialogContent>
  </UDialogRoot>
</template>
