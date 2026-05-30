<script lang="ts" setup>
import { TabsTrigger } from '#components'

const props = defineProps<{
  reaction: string
}>()

const { getReactors } = useRoomEventReactions.inject()
const reactors = computed(() => getReactors(props.reaction))

const count = computed(() => reactors.value?.size ?? 0)
</script>

<template>
  <TabsTrigger as-child :value="reaction">
    <UReactionItem :count :reaction class="bg-secondary gap-2 w-16 cursor-pointer justify-center" />
  </TabsTrigger>
</template>
