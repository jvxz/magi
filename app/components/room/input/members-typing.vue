<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const { areMembersTyping, typingMembers } = useRoomMembersTyping.inject()

const first3TypingMembers = computed(() => [...typingMembers.value].slice(0, 3))
const typingMembersDiff = computed(() => Math.max(0, typingMembers.value.size - 3))
</script>

<template>
  <div class="text-xs px-4 py-1 flex gap-1 h-fit items-center">
    <template v-if="areMembersTyping">
      <div class="pr-4 flex gap-0.5 items-center">
        <div v-for="i in 3" :key="i" class="dot-pulse-animation rounded-full bg-muted-foreground size-2" />
      </div>

      <div class="natural-list inline">
        <UseRoomMember
          v-for="member in first3TypingMembers"
          v-slot="{ roomMember }"
          :key="member"
          :user="member"
          :room="currentRoom"
        >
          <p class="font-medium inline">
            {{ resolveUserName(roomMember) }}
          </p>
        </UseRoomMember>

        <p v-if="typingMembersDiff" class="inline">
          {{ typingMembersDiff }} {{ handlePlural(typingMembersDiff, 'others', 'other') }}
        </p>
      </div>

      <p>{{ handlePlural(typingMembers, 'are', 'is') }} typing</p>
    </template>
  </div>
</template>

<style scoped>
.natural-list p + p::before {
  content: ', ';
  font-weight: normal;
}

.natural-list p:first-child:nth-last-child(2) + p::before {
  content: ' and ';
  font-weight: normal;
}

.natural-list p:not(:first-child):last-child::before {
  content: ', and ';
  font-weight: normal;
}

.dot-pulse-animation {
  --duration: 1.25s;
  animation: var(--duration) ease-out infinite backwards dot-pulse;
  animation-delay: calc(var(--duration) / sibling-count() * (sibling-index() - 1));
}

@keyframes dot-pulse {
  0%,
  60%,
  100% {
    opacity: 25%;
    transform: scale(0.85);
  }
  25% {
    opacity: 100%;
    transform: scale(1);
  }
}
</style>
