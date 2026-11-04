<script lang="ts" setup>
import { injectRoomSettingsDialogContext } from '../room-settings.vue'

export interface RoomSettingsGeneral {
  avatarUrl: string | null
  name: string
}

const { room, unsavedChanges } = injectRoomSettingsDialogContext()
</script>

<template>
  <div class="flex items-center gap-4">
    <MatrixRoomAvatar :room square imageSize="medium" class="rounded-sm size-20 shrink-0" />

    <div class="flex flex-col h-full gap-1 shrink">
      <UEditableRoot
        v-slot="{ modelValue }"
        v-model:model-value="unsavedChanges.name"
        submit-mode="enter"
        class="shrink min-w-0"
      >
        <UEditableArea :trailing-icon="ICON__EDIT" class="*:(text-xl font-medium px-1 -mx-1 shrink)">
          <UEditablePreview>
            <span class="truncate">{{ modelValue }}</span>
            <Icon :name="ICON__EDIT" class="shrink-0 size-0.9em" />
          </UEditablePreview>
          <UEditableInput />
        </UEditableArea>
      </UEditableRoot>

      <UClickToCopy as-child side="right">
        <UButton variant="ghost-inline" class="text-sm font-normal text-muted-foreground">{{ room.roomId }}</UButton>
      </UClickToCopy>
    </div>
  </div>
</template>
