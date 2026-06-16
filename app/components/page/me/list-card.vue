<script lang="ts" setup>
defineProps<{ roomId: string; spaceId: string }>()
</script>

<template>
  <NuxtLink
    class="group"
    :to="{
      name: 'space-room',
      params: {
        roomId,
        spaceId,
      },
    }"
  >
    <URoomShowcaseCardRoot
      v-slot="{ room }"
      :room="roomId"
      class="cursor-pointer group-data-[context-menu-open]:(border-border-strong bg-hover)"
    >
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
  </NuxtLink>
</template>
