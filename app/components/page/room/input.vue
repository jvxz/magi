<script lang="ts" setup>
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { SuggestionOptions } from '@tiptap/suggestion'
import type { RoomMember, User } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'

import { Extension } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extension-placeholder'
import { MsgType } from 'matrix-js-sdk'
import { useFilter } from 'reka-ui'
import CodeBlockShiki from 'tiptap-extension-code-block-shiki'
import { VList } from 'virtua/vue'

const currentRoom = useCurrentRoom()
const currentSpace = useCurrentSpace()

const content = shallowRef('')

const { areMembersTyping, onType } = useRoomMembersTyping.provide(currentRoom)

const { contains } = useFilter({ sensitivity: 'base' })

const { members } = useRoomMembers(currentRoom)
const { rooms } = useSpaceHierarchy(() => currentSpace.value?.roomId)
const roomsArray = computed(() => (rooms.value ? rooms.value.values().toArray() : []))

type SuggestionItem = { id: string; label: string } & (
  | {
      user: RoomMember | User
      room?: never
    }
  | {
      user?: never
      room: IHierarchyRoom
    }
)

const open = shallowRef(false)
const highlightedIdx = shallowRef(0)
const filteredItems = shallowRef<SuggestionItem[]>([])
let command: ((props: MentionNodeAttrs) => void) | undefined

const listHeight = computed(() => Math.min(filteredItems.value.length, 7) * 32)

const { message } = useRoomActions(currentRoom)

function selectItem(item: SuggestionItem) {
  command?.({ id: item.id, label: item.label })
}

function createSuggestion(
  char: string,
  getItems: (query: string) => SuggestionItem[],
): Omit<SuggestionOptions<any, MentionNodeAttrs>, 'editor'> {
  return {
    char,
    items: ({ query }) => getItems(query),
    render: () => ({
      onExit: () => (open.value = false),
      onKeyDown: ({ event }) => handleKeyDown(event),
      onStart: ({ command: commandLocal, items }) => {
        command = commandLocal
        filteredItems.value = items
        highlightedIdx.value = 0
        open.value = true
      },
      onUpdate: ({ command: commandLocal, items }) => {
        command = commandLocal
        filteredItems.value = items
        highlightedIdx.value = 0
      },
    }),
  }
}

const editor = useEditor({
  extensions: [
    TiptapStarterKit.configure({
      bold: false,
      code: false,
      codeBlock: false,
      heading: false,
      italic: false,
      link: false,
      strike: false,
      trailingNode: false,
      underline: false,
    }),
    CodeBlockShiki.configure({
      defaultTheme: 'github-dark-default',
    }),
    Emoji,
    Mention.configure({
      suggestions: [
        createSuggestion('#', query =>
          roomsArray.value
            .filter(r => r.name && contains(r.name, query))
            .map(r => ({ id: r.room_id, label: r.name ?? r.room_id, room: r })),
        ),
        createSuggestion('@', query =>
          (members.value ?? [])
            .filter(u => contains([resolveUserName(u), u.userId].join(' '), query))
            .map(u => ({ id: u.userId, label: resolveUserName(u), user: u })),
        ),
      ],
    }),
    InlineMarks,
    Placeholder.configure({
      placeholder: () => `Message ${currentRoom.value?.name}`,
    }),
    Extension.create({
      addKeyboardShortcuts() {
        return {
          Enter: ({ editor }) => {
            const formattedContent = content.value.trim()
            if (!formattedContent) return true

            message.mutate({
              content: {
                body: formattedContent,
                msgtype: MsgType.Text,
              },
            })

            onType(true)

            editor.commands.clearContent()

            return true
          },
          Escape: () => {
            this.editor.commands.blur()
            return true
          },
        }
      },
    }),
  ],
  onUpdate: ({ editor }) => {
    content.value = editor.getText()
    if (content.value.trim()) onType()
    else onType(true)
  },
})

function handleKeyDown(event: KeyboardEvent) {
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
}

watch(currentRoom, () => {
  editor.value?.view.dispatch(editor.value.view.state.tr)
})

onStartTyping(e => editor.value?.chain().focus('end').insertContent(e.key).run())

const vlist = useTemplateRef('vlist')
watch(highlightedIdx, idx => vlist.value?.scrollToIndex(idx, { align: 'nearest' }))
</script>

<template>
  <div class="mb-3 px-3 rounded flex shrink-0 flex-col w-full bottom-0 absolute isolate">
    <PageRoomInputMembersTyping v-if="!open" />

    <div v-if="open" :class="cn(popoverContentBase(), 'w-full border-border-strong h-full bg-secondary mb-3.5')">
      <VList
        v-if="filteredItems.length"
        ref="vlist"
        v-slot="{ item, index }"
        :data="filteredItems"
        :style="{
          minHeight: `${listHeight}px`,
        }"
      >
        <UButton
          :key="item.id"
          variant="ghost"
          :data-highlighted="highlightedIdx === index"
          class="gap-2 w-full justify-start data-[highlighted=false]:(text-muted-foreground bg-transparent hover:text-muted-foreground hover:bg-transparent) data-[highlighted=true]:(text-foreground bg-secondary-raised hover:bg-secondary-raised)"
          @mouseenter="highlightedIdx = index"
          @mousedown.prevent="selectItem(item)"
        >
          <MatrixAvatar v-if="item.user" class="h-4 w-fit" :user="item.user" />
          <MatrixAvatar v-else class="h-4 w-fit" :room="item.room" />

          <span class="text-foreground">{{ item.label }}</span>
          <span class="text-xs font-normal">{{ item.id }}</span>
        </UButton>
      </VList>

      <UButton v-else variant="ghost" disabled class="gap-2 w-full justify-start opacity-100!">
        <span class="text-muted-foreground font-normal">No results</span>
      </UButton>
    </div>

    <div
      class="px-3.5 border rounded bg-input flex gap-3.5 size-full h-user-card-height items-center has-focus-visible:border-border-strong *:shrink-0"
    >
      <UButton variant="ghost" size="icon">
        <Icon name="tabler:plus" class="size-5" />
      </UButton>

      <TiptapEditorContent class="flex-1" role="presentation" :editor />

      <UButton variant="ghost" size="icon" :disabled="!content">
        <Icon name="tabler:send" class="size-5" />
      </UButton>
    </div>

    <div
      v-if="!open"
      aria-hidden="true"
      class="h-full w-full pointer-events-none transition-all ease absolute from-surface to-transparent from-75% bg-linear-to-t -mx-3 -z-2"
      :class="areMembersTyping ? '-top-2' : 'top-2'"
    />
  </div>
</template>

<style>
.ProseMirror {
  @apply outline-0 h-user-card-height flex flex-col justify-center;
}

.tiptap {
  .md-marker {
    @apply text-muted-foreground;
    text-decoration: none;
    font-style: normal;
  }

  .md-codespan:not(.md-marker),
  pre {
    @apply bg-muted font-mono px-0.5 -m-0.25 mx-0.75 rounded-sm;
  }

  .md-em:not(.md-marker) {
    @apply italic;
  }

  .md-link:not(.md-marker) {
    @apply underline text-primary cursor-pointer;
  }

  .md-strikethrough:not(.md-marker) {
    text-decoration: line-through;
  }

  .md-strong:not(.md-marker) {
    @apply font-medium;
  }

  .md-underline:not(.md-marker) {
    @apply underline;
  }

  [data-type='mention'] {
    @apply bg-primary/50 px-0.5 -m-0.25 mx-0.75 rounded-sm;
    user-select: auto;
  }

  p.is-editor-empty:first-child::before {
    @apply text-muted-foreground h-0 pointer-events-none;
    content: attr(data-placeholder);
    float: left;
  }

  blockquote {
    @apply border-l-3 border-border-strong pl-3 text-muted-foreground;
  }

  h1 {
    @apply text-4xl;
  }
  h2 {
    @apply text-3xl;
  }
  h3 {
    @apply text-2xl;
  }
  h4 {
    @apply text-xl;
  }

  li p {
    display: inline;
  }

  ul,
  ol {
    padding-left: 1.5em;
    list-style-type: disc;
  }

  ul ul {
    list-style-type: circle;
  }
  ul ul ul {
    list-style-type: square;
  }
}
</style>
