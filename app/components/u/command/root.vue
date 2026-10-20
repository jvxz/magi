<script lang="ts">
import type { Ref } from 'vue'

export const [useCommand, provideCommandContext] = createContext<{
  allItems: Ref<Map<string, string>>
  allGroups: Ref<Map<string, Set<string>>>
  filterState: {
    search: string
    filtered: { count: number; items: Map<string, number>; groups: Set<string> }
  }
}>('Command')

export const [useCommandGroup, provideCommandGroupContext] = createContext<{
  id?: string
}>('CommandGroup')
</script>

<script setup lang="ts">
import type { ListboxRootEmits, ListboxRootProps } from 'reka-ui'

import { useFilter, useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<ListboxRootProps & { class?: HTMLAttributes['class'] }>(), {
  modelValue: '',
})

const emits = defineEmits<ListboxRootEmits>()

const delegated = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegated, emits)

const allItems = ref<Map<string, string>>(new Map())
const allGroups = ref<Map<string, Set<string>>>(new Map())

const { contains } = useFilter({ sensitivity: 'base' })
const filterState = reactive({
  filtered: {
    count: 0,
    groups: new Set() as Set<string>,
    items: new Map() as Map<string, number>,
  },
  search: '',
})

function filterItems() {
  if (!filterState.search) {
    filterState.filtered.count = allItems.value.size
    return
  }

  filterState.filtered.groups = new Set()
  let itemCount = 0

  for (const [id, value] of allItems.value) {
    const score = contains(value, filterState.search)
    filterState.filtered.items.set(id, score ? 1 : 0)
    if (score) {
      itemCount++
    }
  }

  for (const [groupId, group] of allGroups.value) {
    for (const itemId of group) {
      if (filterState.filtered.items.get(itemId)! > 0) {
        filterState.filtered.groups.add(groupId)
        break
      }
    }
  }

  filterState.filtered.count = itemCount
}

watch(
  () => filterState.search,
  () => {
    filterItems()
  },
)

provideCommandContext({
  allGroups,
  allItems,
  filterState,
})
</script>

<template>
  <ListboxRoot v-bind="forwarded" :class="cn('flex h-full w-full flex-col overflow-hidden p-0', props.class)">
    <slot />
  </ListboxRoot>
</template>
