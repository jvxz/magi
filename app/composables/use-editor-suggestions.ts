import type { Editor } from '@tiptap/core'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'

export function useEditorSuggestions<T extends { commandProps: unknown }>() {
  const open = shallowRef(false)
  const highlightedIdx = shallowRef(0)
  const filteredItems = shallowRef<T[]>([])
  let command: ((props: MentionNodeAttrs) => void) | undefined

  const listHeight = computed(() => Math.min(filteredItems.value.length, 7) * 32)

  function selectItem(item: T) {
    command?.(item.commandProps as MentionNodeAttrs)
  }

  function createSuggestion(
    char: string,
    getItems: (props: { query: string; editor: Editor }) => T[],
    opts?: {
      onUpdate?: (props: SuggestionProps<any, MentionNodeAttrs>) => void
      shouldOpen?: (props: SuggestionProps<any, MentionNodeAttrs>) => boolean
      command: SuggestionOptions['command']
    },
  ): Omit<SuggestionOptions<any, MentionNodeAttrs>, 'editor'> {
    return {
      char,
      ...(opts?.command && { command: opts.command }),
      items: getItems,
      render: () => ({
        onExit: () => (open.value = false),
        onKeyDown: ({ event }) => {
          const items = filteredItems.value
          if (!items.length) return false
          switch (event.key) {
            case 'ArrowUp':
              highlightedIdx.value = clamp(highlightedIdx.value - 1, 0, items.length - 1)
              return true
            case 'ArrowDown':
              highlightedIdx.value = clamp(highlightedIdx.value + 1, 0, items.length - 1)
              return true
            case 'Enter':
              selectItem(items[highlightedIdx.value]!)
              return true
            case 'Escape':
              open.value = false
              return true
          }
          return false
        },
        onStart: ({ command: commandLocal, items, ...rest }) => {
          command = commandLocal
          filteredItems.value = items
          highlightedIdx.value = 0
          open.value = opts?.shouldOpen ? opts.shouldOpen({ ...rest, command: commandLocal, items }) : true
        },
        onUpdate: ({ command: commandLocal, items, ...rest }) => {
          open.value = opts?.shouldOpen ? opts.shouldOpen({ ...rest, command: commandLocal, items }) : true
          opts?.onUpdate?.({ ...rest, command: commandLocal, items })
          command = commandLocal
          filteredItems.value = items
          highlightedIdx.value = 0
        },
      }),
    }
  }

  return { createSuggestion, filteredItems, highlightedIdx, listHeight, open, selectItem }
}
