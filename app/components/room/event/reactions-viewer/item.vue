<script lang="ts" setup>
import { TabsTrigger } from '#components'

const props = defineProps<{
  reaction: string
  reactors?: Set<string>
}>()

const count = computed(() => props.reactors?.size ?? 0)
</script>

<template>
  <TabsTrigger as-child :value="reaction">
    <UReactionItem :count :reaction class="bg-secondary gap-2 w-16 cursor-pointer justify-center" />
  </TabsTrigger>
</template>
