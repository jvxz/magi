<script lang="ts">
import type { Room } from 'matrix-js-sdk'

import type { GlobalDialogMap } from '~/composables/use-global-dialog'

import { DialogRoomSettingsGeneral, DialogRoomSettingsMembers, DialogRoomSettingsPermissions } from '#components'

import type { SidebarLayoutGroupItem } from '../u/dialog/sidebar-layout-group-item.vue'

export type RoomSettingKey = (typeof roomSettingsTabs)[number]['key']
const roomSettingsTabs = [
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

export interface RoomSettingsDialogContext extends ReturnType<typeof useUnsavedChanges<RoomSettings>> {
  room: Ref<Room>
  permissions: ReturnType<typeof useRoomMemberPermissions>
}

export const [injectRoomSettingsDialogContext, provideRoomSettingsDialogContext] =
  createContext<RoomSettingsDialogContext>('DialogRoomSettings')
</script>

<script lang="ts" setup>
const props = defineProps<GlobalDialogMap['roomSettings']>()

const roomSettingComponents = {
  General: DialogRoomSettingsGeneral,
  Members: DialogRoomSettingsMembers,
  Permissions: DialogRoomSettingsPermissions,
} as const satisfies Record<RoomSettingKey, Component>

const room = toRef(props, 'room')

const selection = ref<RoomSettingKey>(roomSettingsTabs[0].key)

const { self } = useSelf()
const permissions = useRoomMemberPermissions(room, () => self.value?.userId)

const roomSettings = useRoomComputed<RoomSettings>(room, room => ({
  avatarUrl: room.getMxcAvatarUrl(),
  name: room.name,
  topic: getRoomTopic(room),
}))

const unsavedChanges = useUnsavedChanges(roomSettings, noop /* todo */)

provideRoomSettingsDialogContext({
  ...unsavedChanges,
  permissions,
  room,
})

const roomName = useRoomComputed(room, resolveRoomName)
</script>

<template>
  <UDialogRoot>
    <UDialogContent size="md" class="p-0 of-clip">
      <UDialogSidebarLayout>
        <template #sidebar>
          <div class="flex flex-col gap-2 size-full">
            <div class="p-1 flex gap-2 items-center">
              <MatrixRoomAvatar :room square image-size="small" class="rounded-sm size-1.5em" />
              <span class="font-medium">{{ roomName }}</span>
            </div>

            <UDialogSidebarLayoutGroup v-model:model-value="selection" :default-value="roomSettingsTabs[0].key">
              <UDialogSidebarLayoutGroupItem
                v-for="setting in roomSettingsTabs"
                :key="setting.key"
                :value="setting.key"
              >
                <Icon :name="setting.icon" />
                <span>{{ setting.key }}</span>
              </UDialogSidebarLayoutGroupItem>
            </UDialogSidebarLayoutGroup>
          </div>
        </template>

        <component :is="roomSettingComponents[selection]" v-if="selection" />

        <Transition :name="unsavedChanges.isDirty.value ? 'flip-up' : 'flip-down'">
          <UDialogUnsavedChanges
            v-if="unsavedChanges.isDirty.value"
            variant="raised"
            class="flex items-center justify-center px-2"
          >
            <div class="flex items-center justify-between w-full">
              <span class="text-sm ps-1 font-medium">There are unsaved changes</span>

              <div class="flex items-center gap-2">
                <UButton @click="unsavedChanges.resetChanges()" variant="ghost-raised"> Reset </UButton>
                <UButton @click="unsavedChanges.commitChanges()" variant="default"> Confirm </UButton>
              </div>
            </div>
          </UDialogUnsavedChanges>
        </Transition>
      </UDialogSidebarLayout>
    </UDialogContent>
  </UDialogRoot>
</template>
