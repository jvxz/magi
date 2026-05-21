<script lang="ts" setup>
const props = defineProps<{
  reaction: string
}>()

const { error, getReactors, isReactingTo, reactTo } = useRoomEventReactions.inject()

const selfReactionEvent = computed(() => isReactingTo(props.reaction))
const realCount = computed(() => getReactors(props.reaction)?.size ?? 0)

const localIsReacting = shallowRef(!!selfReactionEvent.value)
const localCount = ref(realCount.value)
const prevLocalCount = refDefault(usePrevious(localCount), 0)

watch(localIsReacting, is => {
  localCount.value += is ? 1 : -1
  reactTo(props.reaction, is)
})

syncRef(realCount, localCount)

watch(error, () => (localCount.value = realCount.value))
</script>

<template>
  <div v-if="localCount" class="py-1">
    <UToggle
      :key="reaction"
      v-model:model-value="localIsReacting"
      size="sm"
      class="text-sm p-1 px-2 border-px rounded flex gap-2 min-w-12 select-none items-center overflow-clip data-[state=off]:(border-transparent bg-card-lightest) data-[state=on]:(border-primary bg-primary/50 hover:bg-primary/50)"
      :data-count="realCount"
      @mouseover="getReactors(reaction)"
    >
      <span class="truncate">{{ reaction }}</span>

      <div class="h-1lh relative">
        <span class="font-semibold opacity-0 select-none tabular-nums" aria-hidden="true">{{ localCount }}</span>

        <Transition :name="prevLocalCount > localCount ? 'flip-up' : 'flip-down'">
          <span :key="localCount" class="font-semibold flex items-center inset-0 justify-center absolute tabular-nums">
            {{ localCount }}
          </span>
        </Transition>
      </div>
    </UToggle>
  </div>
</template>
