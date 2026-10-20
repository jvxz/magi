<script lang="ts" setup>
import type { RoomMember } from 'matrix-js-sdk'

import { injectSpaceMembersListContext } from '~/pages/app/space/[spaceId]/members.vue'

defineProps<{ member: RoomMember }>()
const { spaceId } = injectSpaceMembersListContext()

const creator = useRoomComputed(spaceId, r => r?.getCreator())
</script>

<template>
  <UCardGroupItem variant="raised">
    <div class="flex gap-2 items-center">
      <UCardGroupItemImage
        as-child
        :dialog="{ label: resolveUserName(member), member, type: 'roomMember', room: spaceId! }"
        class="size-10"
      >
        <MatrixRoomMemberAvatar :room="spaceId" :member square image-size="small" />
      </UCardGroupItemImage>

      <UCardGroupItemHeader class="gap-1 justify-center">
        <UCardGroupItemTitle as="div" :title="resolveUserName(member)" class="flex gap-2 items-center">
          <p class="truncate">{{ resolveUserName(member) }}</p>

          <UTooltipRoot>
            <UTooltipTrigger as-child>
              <Icon v-if="member.userId === creator" class="text-primary" :name="ICON__CREATOR" />
            </UTooltipTrigger>
            <UTooltipContent> Owner </UTooltipContent>
          </UTooltipRoot>
        </UCardGroupItemTitle>

        <UCardGroupItemDescription :title="member.userId" class="flex items-center">
          <UClickToCopy side="right" as-child :with-title="false">
            <UButton variant="ghost-inline" class="text-xs font-normal shrink">
              <span class="truncate">{{ member.userId }}</span>
            </UButton>
          </UClickToCopy>

          <!-- spacer for copy indicator -->
          <span aria-hidden="true" class="shrink-0 w-4" />
        </UCardGroupItemDescription>
      </UCardGroupItemHeader>
    </div>
  </UCardGroupItem>
</template>
