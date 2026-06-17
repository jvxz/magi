<script lang="ts" setup>
const { event, open, room } = useRoomEventReactionsViewer()

const { reactions } = useRoomEventReactions.provide(room, event)
const reactionKeys = computed(() => reactions.value?.keys().toArray())
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

      <TabsRoot :default-value="reactionKeys?.at(0)" class="flex size-full *:p-2">
        <TabsList class="border-r border-border flex shrink-0 flex-col gap-1 items-center">
          <RoomEventReactionsViewerItem v-for="reaction in reactionKeys" :key="reaction" :reaction />
        </TabsList>
        <TabsContent v-for="reaction in reactionKeys" :key="reaction" :value="reaction" as-child>
          <RoomEventReactionsViewerList :reaction />
        </TabsContent>
      </TabsRoot>
    </UDialogContent>
  </UDialogRoot>
</template>
