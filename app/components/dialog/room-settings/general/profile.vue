<script lang="ts" setup>
import { EventType, Visibility } from 'matrix-js-sdk'

import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { room, unsavedChanges, permissions, isEdited } = injectRoomSettingsDialogContext()

const topic = computed({
  get: () => unsavedChanges.value['m.room.topic'].topic ?? '',
  set: (value: string) => {
    if (value.trim()) {
      unsavedChanges.value['m.room.topic'] = { topic: value }
    } else
      unsavedChanges.value['m.room.topic'] = {
        topic: '',
      }
  },
})

const directoryVisibility = computed({
  get: () => unsavedChanges.value.directoryVisibility === Visibility.Public,
  set: (value: boolean) => (unsavedChanges.value.directoryVisibility = value ? Visibility.Public : Visibility.Private),
})

const { uploadContent, progress } = useUploadContent()

const { mutateAsync, isPending } = uploadContent

const { open: openFilePicker, file } = useFileSystemAccess({ types: [MATRIX__ALLOWED_AVATAR_FILE_TYPES] })

const upload = async () => {
  if (!file.value || !isBlob(file.value) || !isFile(file.value)) return
  const res = await mutateAsync({ file: file.value })

  unsavedChanges.value['m.room.avatar'] = { info: await toImageInfo(file.value), url: res.content_uri }
}
whenever(file, upload)

const avatarUrl = useResolveImageUrl(
  () => unsavedChanges.value['m.room.avatar']?.url ?? room.value.getMxcAvatarUrl() ?? undefined,
  { useAuthentication: true },
)

const isPendingDiscoveryVisibility = useIsKeyFetching('roomDirectoryVisibility', () => room.value.roomId)
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- avatar, name -->
    <div class="flex gap-4 items-center">
      <UImgButton
        :progress="progress ? progress.loaded / progress.total : undefined"
        :visible="permissions.canEditRoomAvatar.value"
        :disabled="isPending"
        :icon="ICON__EDIT"
        @click="openFilePicker"
      >
        <Img
          :src="isPending ? '' : avatarUrl"
          :alt="`Avatar of ${resolveRoomName(room)}`"
          image-size="medium"
          class="rounded-sm shrink-0 size-20"
          square
        />
      </UImgButton>

      <div class="flex shrink flex-col gap-1 h-full">
        <UEditableRoot
          v-if="permissions.canEditRoomName.value"
          v-slot="{ modelValue }"
          v-model:model-value="unsavedChanges['m.room.name'].name"
          submit-mode="enter"
          class="shrink min-w-0"
        >
          <UEditableArea :trailing-icon="ICON__EDIT" class="*:(text-xl font-medium px-1 shrink -mx-1)">
            <UEditablePreview>
              <span class="truncate">{{ modelValue }}</span>
              <Icon :name="ICON__EDIT" class="shrink-0 size-0.9em" />
            </UEditablePreview>
            <UEditableInput />
          </UEditableArea>
        </UEditableRoot>
        <p v-else class="text-xl font-medium">{{ unsavedChanges['m.room.name'].name }}</p>

        <UClickToCopy as-child side="right">
          <UButton variant="ghost-inline" class="text-sm text-muted-foreground font-normal">{{ room.roomId }}</UButton>
        </UClickToCopy>
      </div>
    </div>

    <!-- topic -->

    <FormPrimitive label="Topic">
      <UChip :ui="{ root: 'w-full' }" :show="isEdited(s => s[EventType.RoomTopic])">
        <UTextarea
          v-model:model-value="topic"
          class="max-h-36 min-h-10 bg-surface-raised"
          :disabled="!permissions.canEditRoomTopic.value"
          placeholder="What's this room about?"
          resizable="y"
          label="Topic"
        />
      </UChip>
    </FormPrimitive>

    <USettingGroupRoot variant="top">
      <USettingGroupHeader>
        <USettingGroupTitle> Access & discovery </USettingGroupTitle>
      </USettingGroupHeader>

      <USettingGroupContent>
        <USettingGroupItem variant="raised">
          <!-- space access -->
          <USettingComposite label="Space access" description="Change how users are able to join this space">
            <USelectRoot
              v-model:model-value="unsavedChanges['m.room.join_rules'].join_rule"
              :disabled="!permissions.canEditJoinRules.value"
            >
              <UChip :show="isEdited(s => s['m.room.join_rules'])">
                <USelectTrigger variant="soft-raised">
                  {{ MATRIX__JOIN_RULE_NAME_MAP[unsavedChanges['m.room.join_rules'].join_rule] }}
                </USelectTrigger>
              </UChip>

              <USelectContent align="end">
                <USelectItem v-for="rule in MATRIX__JOIN_RULE_SETTABLE_RULES" :key="rule" :value="rule">
                  <USelectItemText>
                    {{ MATRIX__JOIN_RULE_NAME_MAP[rule] }}
                  </USelectItemText>
                </USelectItem>
              </USelectContent>
            </USelectRoot>
          </USettingComposite>
        </USettingGroupItem>

        <USettingGroupSeparator />

        <!-- directory visibility -->
        <USettingGroupItem variant="raised">
          <USettingComposite
            label="Display in directory"
            description="Allow users to discover your space from your homeserver's public directory"
            :is-loading="isPendingDiscoveryVisibility"
            v-slot="{ id }"
          >
            <UChip :show="isEdited(s => s.directoryVisibility)" :ui="{ base: '-top-0.75 -right-0.75' }">
              <USwitch
                :id
                variant="raised"
                class="bg-surface-top border-surface-top"
                :disabled="isPendingDiscoveryVisibility || !permissions.canEditDirectoryVisibility.value"
                v-model:model-value="directoryVisibility"
              />
            </UChip>
          </USettingComposite>
        </USettingGroupItem>
      </USettingGroupContent>
    </USettingGroupRoot>
  </div>
</template>
