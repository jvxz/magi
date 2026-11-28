<script lang="ts" setup>
const props = defineProps<GlobalDialogMap['reactionsViewer']>()
const { reactions, getReactors } = useRoomEventReactions(
  () => props.room,
  () => props.event,
)

const reactionKeys = computed(() => reactions.value?.keys().toArray())

const open = defineModel<boolean>('open')

const currentRoom = useCurrentRoom()
watch(currentRoom, () => (open.value = false))
</script>

<template>
  <UDialogRoot v-model:open="open">
    <UDialogContent class="flex flex-col gap-0 overflow-clip md:h-[60%] md:w-108">
      <UDialogHeader>
        <UDialogTitle>Reactions</UDialogTitle>
        <VisuallyHidden>
          <UDialogDescription>Reactions for the selected event</UDialogDescription>
        </VisuallyHidden>
      </UDialogHeader>

      <TabsRoot :default-value="reactionKeys?.at(0)" class="flex size-full">
        <TabsList class="flex shrink-0 flex-col gap-1 items-center">
          <RoomEventReactionsViewerItem v-for="key in reactionKeys" :key :reaction="key" :reactors="getReactors(key)" />
        </TabsList>

        <USeparator orientation="vertical" class="ml-4 mr-2" />

        <TabsContent v-for="key in reactionKeys" :key :value="key" as-child>
          <RoomEventReactionsViewerList :room :reactors="getReactors(key)" :reaction="key" />
        </TabsContent>
      </TabsRoot>
    </UDialogContent>
  </UDialogRoot>
</template>
