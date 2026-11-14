<script lang="ts" setup>
import { JoinRule, Visibility } from 'matrix-js-sdk'

import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { room, unsavedChanges, permissions, isEdited } = injectRoomSettingsDialogContext()

const supportsKnock = useRoomSupporting(room, 'knock')
const validJoinRules = computed(() =>
  MATRIX__JOIN_RULE_SETTABLE_RULES.filter(r => supportsKnock.value || r !== JoinRule.Knock),
)

const directoryVisibility = computed({
  get: () => unsavedChanges.value.directoryVisibility === Visibility.Public,
  set: (value: boolean) => (unsavedChanges.value.directoryVisibility = value ? Visibility.Public : Visibility.Private),
})
const isPendingDiscoveryVisibility = useIsKeyFetching('roomDirectoryVisibility', () => room.value.roomId)
</script>

<template>
  <USettingGroupRoot variant="top">
    <USettingGroupHeader>
      <USettingGroupTitle> Access & discovery </USettingGroupTitle>
    </USettingGroupHeader>

    <USettingGroupContent>
      <!-- space access -->
      <USettingGroupItem variant="raised">
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
              <USelectItem v-for="rule in validJoinRules" :key="rule" :value="rule">
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
          v-slot="{ id }"
          label="Display in directory"
          description="Allow users to discover your space from your homeserver's public directory"
          :is-loading="isPendingDiscoveryVisibility"
        >
          <UChip :show="isEdited(s => s.directoryVisibility)" :ui="{ base: '-top-0.75 -right-0.75' }">
            <USwitch
              :id
              v-model:model-value="directoryVisibility"
              variant="raised"
              class="border-surface-top bg-surface-top"
              :disabled="isPendingDiscoveryVisibility || !permissions.canEditDirectoryVisibility.value"
            />
          </UChip>
        </USettingComposite>
      </USettingGroupItem>

      <USettingGroupSeparator />

      <!-- history visibility -->
      <USettingGroupItem variant="raised">
        <USettingComposite
          label="History visibility"
          description="Allow users to read messages sent before they joined"
        >
          <USelectRoot
            v-model:model-value="unsavedChanges['m.room.history_visibility'].history_visibility"
            :disabled="!permissions.canEditHistoryVisibility.value"
          >
            <UChip :show="isEdited(s => s['m.room.history_visibility'])">
              <USelectTrigger variant="soft-raised">
                {{
                  MATRIX__HISTORY_VISIBILITY_OPTIONS[unsavedChanges['m.room.history_visibility'].history_visibility]
                    .label
                }}
              </USelectTrigger>
            </UChip>

            <USelectContent align="end">
              <USelectRichItem
                v-for="(option, value) in MATRIX__HISTORY_VISIBILITY_OPTIONS"
                :key="value"
                :value
                :text-value="option.label"
              >
                <USelectRichItemTitle>{{ option.label }}</USelectRichItemTitle>
                <USelectRichItemDescription>{{ option.description }}</USelectRichItemDescription>
              </USelectRichItem>
            </USelectContent>
          </USelectRoot>
        </USettingComposite>
      </USettingGroupItem>
    </USettingGroupContent>
  </USettingGroupRoot>
</template>
