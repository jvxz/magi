<script lang="ts" setup>
const props = defineProps<{
  reaction: string
}>()

const { getReactors, room } = useRoomEventReactions.inject()
const reactors = computed(() => getReactors(props.reaction))
</script>

<template>
  <div class="flex flex-col gap-px size-full">
    <UProfilePopoverTrigger
      v-for="reactor in reactors"
      :key="reactor"
      :user="reactor"
      as-child
      :content-props="{
        alignOffset: 0,
      }"
    >
      <UButton variant="ghost" class="py-2 gap-2 h-auto w-full items-center justify-start text-foreground">
        <UseRoomMember v-slot="{ roomMember }" :room :user="reactor">
          <MatrixAvatar :user="roomMember" class="size-6" />
          <p>{{ resolveUserName(roomMember) }}</p>
        </UseRoomMember>
      </UButton>
    </UProfilePopoverTrigger>
  </div>
</template>
