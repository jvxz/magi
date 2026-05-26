<script lang="ts" setup>
const currentRoom = useCurrentRoom()

const { typingMembers, areMembersTyping } = useRoomMembersTyping.inject()

const first3TypingMembers = computed(() => typingMembers.value.values().take(3))
const typingMembersDiff = computed(() => Math.max(0, typingMembers.value.size - 3))
</script>

<template>
  <div class="h-fit px-4 py-1 text-xs flex items-center gap-1">
    <template v-if="areMembersTyping">
      <div class="flex items-center gap-0.5 pr-4">
        <div class="size-2 bg-muted-foreground rounded-full dot-pulse-animation" v-for="i in 3" :key="i" />
      </div>

      <div class="natural-list inline">
        <UseRoomMember
          v-for="member in first3TypingMembers"
          :user="member"
          :room="currentRoom"
          v-slot="{ roomMember }"
          :key="member"
        >
          <p class="font-medium inline">
            {{ resolveUserName(roomMember) }}
          </p>
        </UseRoomMember>

        <p class="inline" v-if="typingMembersDiff">
          {{ typingMembersDiff }} {{ handlePlural(typingMembersDiff, 'others', 'other') }}
        </p>
      </div>

      <p>{{ handlePlural(!!typingMembersDiff ? typingMembersDiff : typingMembers, 'are', 'is') }} typing</p>
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
