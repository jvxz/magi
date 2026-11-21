<script lang="ts" setup>
defineProps<{
  reaction: string
  reactors?: Set<string>
  room: MaybeRoomOrId
}>()
</script>

<template>
  <div :tabindex="-1" class="flex flex-col gap-px size-full -my-1">
    <UProfilePopoverTrigger
      v-for="reactor in reactors"
      :key="reactor"
      :user="reactor"
      as-child
      :content-props="{
        alignOffset: -1,
        sideOffset: 4,
      }"
    >
      <UButton variant="ghost" class="text-foreground p-1.5 gap-2 h-auto w-full items-center justify-start">
        <UseRoomMember v-slot="{ roomMember }" :room :user="reactor">
          <MatrixRoomMemberAvatar :room :member="reactor" class="shrink-0 size-6" />
          <p class="truncate">{{ resolveUserName(roomMember) }}</p>
        </UseRoomMember>
      </UButton>
    </UProfilePopoverTrigger>
  </div>
</template>
