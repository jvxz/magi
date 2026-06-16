<script lang="ts" setup>
defineProps<{ roomId: string; spaceId: string }>()
</script>

<template>
  <URoomShowcaseCardRoot v-slot="{ room }" :room="roomId">
    <URoomShowcaseCardContent>
      <URoomShowcaseCardTitle class="flex items-center">
        <span>{{ room?.name }}</span>
      </URoomShowcaseCardTitle>

      <URoomShowcaseCardDescription>
        {{ room?.getJoinedMemberCount() }} members
        <template v-if="getRoomTopic(room)">
          <UInlineSeparator />
          <span> {{ getRoomTopic(room) }}</span>
        </template>
      </URoomShowcaseCardDescription>
    </URoomShowcaseCardContent>
  </URoomShowcaseCardRoot>
</template>
