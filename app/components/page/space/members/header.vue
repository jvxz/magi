<script lang="ts" setup>
import { injectSpaceMembersListContext } from '~/pages/app/space/[spaceId]/members.vue'

const { filteredMembers, inputQuery, spaceId } = injectSpaceMembersListContext()
const hasQuery = computed(() => !!inputQuery.value.trim().length)

const invitedMemberCount = useRoomComputed(spaceId, r => r?.getInvitedMemberCount())
</script>

<template>
  <UShowcaseHeader>
    <UShowcaseTitle>
      <span>Members</span>
    </UShowcaseTitle>

    <UShowcaseDetails>
      <UShowcaseDetailsItem>
        <Icon :name="ICON__MEMBER_COUNT" />
        <span>{{ filteredMembers.length }} joined</span>
      </UShowcaseDetailsItem>

      <template v-if="!hasQuery">
        <UInlineSeparator />
        <UShowcaseDetailsItem>
          <Icon :name="ICON__INVITE" />
          <span>{{ invitedMemberCount }} invited</span>
        </UShowcaseDetailsItem>
      </template>
      <p v-else class="text-muted-foreground">(filtered)</p>
    </UShowcaseDetails>
  </UShowcaseHeader>
</template>
