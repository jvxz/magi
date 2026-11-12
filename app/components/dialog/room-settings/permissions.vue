<script lang="ts" setup>
import { injectRoomSettingsDialogContext } from '../room-settings.vue'

const { unsavedChanges, isEdited } = injectRoomSettingsDialogContext()
</script>

<template>
  <div class="flex flex-col gap-4">
    <USettingGroupRoot>
      <USettingGroupContent>
        <USettingGroupItem variant="raised">
          <USettingComposite
            label="Default power level"
            description="Power level for users who were not specifically assigned one"
          >
            <UChip :show="isEdited(s => s['m.room.power_levels'].events_default)">
              <UNumberField
                v-model:model-value="unsavedChanges['m.room.power_levels'].events_default"
                :default-value="0"
                :max="MATRIX__POWERLEVEL_MAX"
                :min="MATRIX__POWERLEVEL_MIN"
                variant="top"
                class="w-36"
              />
            </UChip>
          </USettingComposite>
        </USettingGroupItem>
      </USettingGroupContent>
    </USettingGroupRoot>

    <DialogRoomSettingsPermissionsGroups />
  </div>
</template>
