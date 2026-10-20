<script lang="ts" setup>
const props = defineProps<{
  entries: (PinnedRoomEntry | RecentRoomEntry)[]
  label: string
  type: 'pinned' | 'recent'
  cachedCount: number
}>()

const open = defineModel<boolean>()

const matrixStatus = useMatrixStatus()
const state = computed(() => {
  if (!matrixStatus.value.isDataSynced && !props.entries.length) return 'skeleton'
  return props.entries.length ? 'entries' : 'empty'
})
</script>

<template>
  <UCollapsibleRoot v-model:open="open" class="shrink-0">
    <UCollapsibleTrigger>
      <UCollapsibleTriggerIcon />
      <span>{{ label }}</span>
    </UCollapsibleTrigger>

    <UCollapsibleContent bar>
      <UCollapsibleContentBar />

      <UCardGroupRoot variant="raised" class="w-full">
        <template v-if="state === 'entries'">
          <template v-for="(entry, i) in entries" :key="entry.roomId">
            <UCardGroupSeparator v-if="i" />
            <PageMeRoomListCard :entry :type />
          </template>
        </template>

        <div v-else-if="state === 'empty'" class="text-sm text-muted-foreground p-3 flex gap-1 items-center">
          <Icon :name="ICON__EMPTY" />
          <span>{{ type === 'pinned' ? 'You have no pinned rooms' : 'You have no recent rooms' }}</span>
        </div>

        <template v-else>
          <template v-for="i in cachedCount" :key="i">
            <UCardGroupSeparator v-if="i - 1" />

            <URoomShowcaseCardRoot group variant="raised">
              <URoomShowcaseCardContent>
                <USkeleton class="rounded-sm size-full h-10" />
              </URoomShowcaseCardContent>
            </URoomShowcaseCardRoot>
          </template>
        </template>
      </UCardGroupRoot>
    </UCollapsibleContent>
  </UCollapsibleRoot>
</template>
