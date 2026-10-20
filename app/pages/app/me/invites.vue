<script lang="ts" setup>
definePageMeta({
  name: 'invites',
})

defineAppLabel({ label: 'Invites' })

const { invites } = useInvites()

const contextMenuOpen = ref(false)
watch(
  () => invites.value.size,
  () => (contextMenuOpen.value = false),
)
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader :icon="ICON__INBOX"> Invites </LayoutAppPageHeader>
  </LayoutAppSlot>

  <LayoutAppGenericPage class="pb-page-y-padding size-full">
    <UShowcaseRoot>
      <UShowcaseHeader>
        <UShowcaseTitle> Invites </UShowcaseTitle>
      </UShowcaseHeader>
    </UShowcaseRoot>

    <UShowcaseSeparator />

    <UShowcaseContent class="size-full">
      <UContextMenuRegionRoot v-model:open="contextMenuOpen" name="invite">
        <template v-if="invites.size">
          <UCardGroupRoot variant="raised">
            <template v-for="(inviteRoom, i) in invites" :key="inviteRoom.roomId">
              <UCardGroupSeparator v-if="i" />
              <PageMeInvitesCard :invite-room />
            </template>
          </UCardGroupRoot>
        </template>

        <UEmptyRoot v-else class="size-full items-center justify-center">
          <UEmptyIcon variant="naked" :name="ICON__INBOX" />
          <UEmptyDescription> No pending invites </UEmptyDescription>
        </UEmptyRoot>

        <UContextMenuRegionContent v-slot="{ payload }" name="invite">
          <PageMeInvitesCardContextMenu :payload />
        </UContextMenuRegionContent>
      </UContextMenuRegionRoot>
    </UShowcaseContent>
  </LayoutAppGenericPage>
</template>
