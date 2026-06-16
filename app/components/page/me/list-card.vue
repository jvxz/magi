<script lang="ts" setup>
defineProps<{ roomId: string; spaceId: string }>()
</script>

<template>
  <URoomShowcaseCardRoot :room="roomId" v-slot="{ room }">
    <URoomShowcaseCardContent>
      <URoomShowcaseCardTitle class="flex items-center">
        <span>{{ room?.name }}</span>
      </URoomShowcaseCardTitle>

      <URoomShowcaseCardDescription>
        <UseRoom v-if="spaceId" :room="spaceId" v-slot="{ room }">
          {{ room?.getJoinedMemberCount() }} members
          <template v-if="getRoomTopic(room)">
            <UInlineSeparator />
            <span> {{ getRoomTopic(room) }}</span>
          </template>
        </UseRoom>
      </URoomShowcaseCardDescription>
    </URoomShowcaseCardContent>
  </URoomShowcaseCardRoot>
</template>
