<script lang="ts" setup>
const props = defineProps<{
  entries: (PinnedRoomEntry | RecentRoomEntry)[]
  label: string
  cachedCount: number
}>()

const open = defineModel<boolean>()

const matrixStatus = useMatrixStatus()
const state = computed(() => {
  if (matrixStatus.value.isDataSynced) return 'ready'
  if (!matrixStatus.value.isDataSynced && props.entries.length) return 'loading'
  return 'empty'
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
        <template v-if="state !== 'empty'">
          <template v-for="(entry, i) in entries" :key="entry.roomId">
            <UCardGroupSeparator v-if="i" />
            <PageMeRoomListCard :entry />
          </template>
        </template>

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
