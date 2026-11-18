<script lang="ts" setup>
import { required } from '@regle/rules'

import { injectRoomSettingsDialogContext } from '../../room-settings.vue'

const { unsavedChanges, isEdited, permissions, room, roomNoun } = injectRoomSettingsDialogContext()

const { isSuccess: hasLoadedAliases } = useRoomLocalAliases(room)
const canEdit = computed(() => permissions.canEditCanonicalAlias.value && hasLoadedAliases.value)

const { client } = useMatrixClient()
const domain = computed(() => client.value.getDomain()!)

const aliasInput = ref('')
const { r$ } = useRegle(
  {
    aliasInput,
  },
  () => ({
    aliasInput: {
      homeserverAliasCharacters: homeserverAliasCharacters(domain.value),
      homeserverAliasMaxSize: homeserverAliasMaxSize(domain.value),
      noSpaces,
      required,
    },
  }),
)

const publishedAliases = computed(() => flattenRoomAliases(unsavedChanges.value['m.room.canonical_alias']))
const allAliases = computed(() =>
  uniq([...publishedAliases.value, ...unsavedChanges.value.localAliases]).toSorted((a, b) => a.localeCompare(b)),
)

const addAlias = () => {
  if (!canEdit.value || r$.aliasInput.$error) return
  unsavedChanges.value.localAliases = uniq([
    ...unsavedChanges.value.localAliases,
    createAliasString(aliasInput.value, domain.value),
  ])
  r$.$reset({ toOriginalState: true })
}

const isPublished = (alias: string) => publishedAliases.value.includes(alias)
const setPublished = (alias: string) => {
  const content = unsavedChanges.value['m.room.canonical_alias']
  content.alt_aliases = [...(content.alt_aliases ?? []), alias]
}
const setUnpublished = (alias: string) => {
  const content = unsavedChanges.value['m.room.canonical_alias']
  if (content.alias === alias) delete content.alias
  content.alt_aliases = content.alt_aliases?.filter(a => a !== alias)
}

const isMain = (alias: string) => alias === unsavedChanges.value['m.room.canonical_alias'].alias
const setMain = (alias: string) => {
  const content = unsavedChanges.value['m.room.canonical_alias']
  const alts = (content.alt_aliases ?? []).filter(a => a !== alias)
  if (content.alias) alts.push(content.alias)
  content.alias = alias
  content.alt_aliases = alts
}
const unsetMain = () => {
  const content = unsavedChanges.value['m.room.canonical_alias']
  if (!content.alias) return
  content.alt_aliases = [...(content.alt_aliases ?? []), content.alias]
  delete content.alias
}

const deleteAlias = (alias: string) => {
  setUnpublished(alias)
  unsavedChanges.value.localAliases = unsavedChanges.value.localAliases.filter(a => a !== alias)
}
</script>

<template>
  <USettingGroupRoot>
    <USettingGroupHeader>
      <USettingGroupTitle> Addresses </USettingGroupTitle>
    </USettingGroupHeader>

    <USettingGroupContent>
      <USettingGroupItem variant="raised" class="pb-0">
        <USettingComposite
          class="flex-col items-start"
          :description="`Users can join the ${roomNoun} using any of these addresses. Published addresses are shown on the ${roomNoun} for everyone to see`"
        >
          <UChip
            :show="isEdited(s => s.localAliases) || isEdited(s => s['m.room.canonical_alias'])"
            :ui="{ root: 'size-full' }"
          >
            <UTableRoot variant="top" class="w-full">
              <UTableBody>
                <UDropdownMenuRoot v-for="alias in allAliases" :key="alias">
                  <UTableRow>
                    <UTableRowCell class="flex items-center justify-between">
                      <div class="flex gap-2 items-center">
                        <span class="font-medium">
                          {{ alias }}
                        </span>
                        <UBadge v-if="isMain(alias)" size="sm"> Main </UBadge>
                        <UBadge v-else-if="isPublished(alias)" size="sm" variant="soft"> Published </UBadge>
                      </div>

                      <UDropdownMenuTrigger :disabled="!canEdit" as-child>
                        <UButton variant="ghost" size="icon-sm">
                          <Icon :name="ICON__MORE" />
                        </UButton>
                      </UDropdownMenuTrigger>
                    </UTableRowCell>
                  </UTableRow>

                  <UDropdownMenuContent align="end">
                    <UDropdownMenuItem v-if="!isMain(alias)" @select="setMain(alias)"> Set main </UDropdownMenuItem>
                    <UDropdownMenuItem v-else @select="unsetMain()"> Unset main </UDropdownMenuItem>

                    <UDropdownMenuItem v-if="!isPublished(alias)" @select="setPublished(alias)">
                      Publish
                    </UDropdownMenuItem>
                    <UDropdownMenuItem v-else @select="setUnpublished(alias)"> Unpublish </UDropdownMenuItem>

                    <UDropdownMenuItem variant="danger" @select="deleteAlias(alias)"> Delete </UDropdownMenuItem>
                  </UDropdownMenuContent>
                </UDropdownMenuRoot>
              </UTableBody>
            </UTableRoot>
          </UChip>
        </USettingComposite>
      </USettingGroupItem>

      <USettingGroupItem variant="raised">
        <FormPrimitive v-slot="{ id }" :error="r$.aliasInput.$value && r$.aliasInput.$errors" label="Add address">
          <div class="flex gap-2 items-center">
            <UInputGroupRoot :disabled="!canEdit" class="shrink w-full" variant="top">
              <UInputGroupAddon>
                <Icon :name="ICON__POUND" />
              </UInputGroupAddon>

              <UInputGroupField :id v-model:model-value="r$.aliasInput.$value" @keydown.enter="addAlias" />

              <UInputGroupAddon> :{{ domain }} </UInputGroupAddon>
            </UInputGroupRoot>
            <UButton :disabled="r$.aliasInput.$error || !r$.aliasInput.$dirty" @click="addAlias"> Add address </UButton>
          </div>
        </FormPrimitive>
      </USettingGroupItem>
    </USettingGroupContent>
  </USettingGroupRoot>
</template>
