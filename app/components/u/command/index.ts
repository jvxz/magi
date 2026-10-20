import type { Ref } from 'vue'

export { default as CommandDialog } from './dialog.vue'
export { default as CommandEmpty } from './empty.vue'
export { default as CommandGroup } from './group.vue'
export { default as CommandInput } from './input.vue'
export { default as CommandItem } from './item.vue'
export { default as CommandList } from './list.vue'
export { default as CommandRoot } from './root.vue'
export { default as CommandShortcut } from './shortcut.vue'

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
