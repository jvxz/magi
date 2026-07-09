<script lang="ts" setup>
definePageMeta({
  name: 'invites',
})

defineAppLabel({ label: 'Invites' })

const { invites } = useInvites()
</script>

<template>
  <LayoutAppSlot name="page-header">
    <LayoutAppPageHeader icon="tabler:inbox"> Invites </LayoutAppPageHeader>
  </LayoutAppSlot>

  <LayoutAppGenericPage class="size-full pb-page-y-padding">
    <UShowcaseRoot>
      <UShowcaseHeader>
        <UShowcaseTitle> Invites </UShowcaseTitle>
      </UShowcaseHeader>
    </UShowcaseRoot>

    <UShowcaseSeparator />

    <UShowcaseContent class="size-full">
      <UContextMenuRegionRoot name="invite">
        <template v-if="invites.length">
          <PageMeInvitesCard v-for="inviteRoom in invites" :key="inviteRoom.roomId" :invite-room />
        </template>

        <UEmptyRoot v-else class="size-full items-center justify-center">
          <UEmptyIcon variant="naked" name="tabler:inbox" />
          <UEmptyDescription> No pending invites </UEmptyDescription>
        </UEmptyRoot>

        <UContextMenuRegionContent name="invite" v-slot="{ payload }">
          <UContextMenuItem> Accept </UContextMenuItem>
          <UContextMenuItem> Decline </UContextMenuItem>
        </UContextMenuRegionContent>
      </UContextMenuRegionRoot>
    </UShowcaseContent>
  </LayoutAppGenericPage>
</template>
