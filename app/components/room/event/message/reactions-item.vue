<script lang="ts" setup>
import { UToggle } from '#components'

const props = defineProps<{
  reaction: string
}>()

const { error, event, getReactors, isReactingTo, reactTo, room } = useRoomEventReactions.inject()
const { openReactionViewer } = useRoomEventReactionsViewer()

const tooltipOpen = shallowRef(false)

const selfReactionEvent = computed(() => isReactingTo(props.reaction))
const reactors = computed(() => getReactors(props.reaction))
const realCount = computed(() => reactors.value?.size ?? 0)

const localIsReacting = shallowRef(!!selfReactionEvent.value)
const localCount = ref(realCount.value)

const { ignoreUpdates } = watchIgnorable(localIsReacting, is => {
  localCount.value += is ? 1 : -1
  reactTo(props.reaction, is)
})

watch(selfReactionEvent, event => {
  ignoreUpdates(() => {
    localIsReacting.value = !!event
  })
})

syncRef(realCount, localCount, { direction: 'ltr' })

watch(error, () => (localCount.value = realCount.value))

const reactorsString = computed(() => {
  const r = room.value
  if (!r || !reactors.value) return ''

  if (reactors.value.size > 3) {
    const diff = reactors.value.size - 3

    const firstThree = [...reactors.value].slice(0, 3)

    return `${firstThree.map(reactor => getRoomMemberDisplayName(r, reactor)).join(', ')}, and ${diff} ${handlePlural(diff, 'others', 'other')}`
  }

  return Array.from(reactors.value, reactor => getRoomMemberDisplayName(r, reactor)).join(', ')
})

function handleReactionViewer() {
  openReactionViewer(room.value, event.value)
  tooltipOpen.value = false
}
</script>

<template>
  <div v-if="localCount" class="py-1">
    <UTooltipRoot v-model:open="tooltipOpen">
      <UTooltipTrigger as-child>
        <UReactionItem
          :key="reaction"
          v-model:model-value="localIsReacting"
          :as="UToggle"
          :count="localCount"
          :reaction
          size="sm"
          class="text-sm text-foreground p-1 px-2 border-px rounded flex gap-2 min-w-12 select-none items-center overflow-clip aria-[pressed=false]:(border-transparent bg-secondary) aria-[pressed=true]:(border-primary bg-primary/50 hover:bg-primary/50)"
          :data-count="realCount"
          @mouseover="getReactors(reaction)"
        />
      </UTooltipTrigger>

      <UTooltipContent class="font-normal py-3 bg-popover flex gap-2 max-w-64 min-w-48 items-center">
        <Twemojify :text="reaction" class="text-10 shrink-0" />

        <p role="button" class="font-normal cursor-pointer hover:underline" @click="handleReactionViewer">
          reacted by {{ reactorsString }}
        </p>
      </UTooltipContent>
    </UTooltipRoot>
  </div>
</template>
