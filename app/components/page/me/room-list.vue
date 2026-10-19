<script lang="ts" setup>
const props = defineProps<{
  entries: (PinnedRoomEntry | RecentRoomEntry)[]
  label: string
}>()

const open = defineModel<boolean>()
</script>

<template>
  <UCollapsibleRoot v-model:open="open">
    <UCollapsibleTrigger>
      <UCollapsibleTriggerIcon />
      <span>{{ label }}</span>
    </UCollapsibleTrigger>

    <UCollapsibleContent bar>
      <UCollapsibleContentBar />

      <UCardGroupRoot variant="raised" class="w-full">
        <template v-for="(entry, i) in entries" :key="entry.roomId">
          <UCardGroupSeparator v-if="i" />
          <PageMeRoomListCard :entry />
        </template>
      </UCardGroupRoot>
    </UCollapsibleContent>
  </UCollapsibleRoot>
</template>
