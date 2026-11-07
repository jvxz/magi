<script lang="ts" setup>
import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { room, unsavedChanges, permissions } = injectRoomSettingsDialogContext()

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

    <FormInput
      v-model:model-value="topic"
      :disabled="!permissions.canEditRoomTopic.value"
      resizable="y"
      label="Topic"
      textarea
      :ui="{ input: 'max-h-32 min-h-8' }"
    />
  </div>
</template>
