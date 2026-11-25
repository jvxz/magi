import type { Editor } from '@tiptap/core'
import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Node } from '@tiptap/pm/model'
import type { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion'
import type { RoomMember } from 'matrix-js-sdk'
import type { Room } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'

import { Extension } from '@tiptap/core'
import { Mention } from '@tiptap/extension-mention'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Fragment, Slice } from '@tiptap/pm/model'
import { toRef } from '@vueuse/core'
import { useFilter } from 'reka-ui'

import type { PickerEmoji } from '~/components/emoji-picker/root.vue'

import { fromCompactEmoji, fromImagePack, getEmojiNodeAttrs } from '~/components/emoji-picker/root.vue'

type SuggestionItem = { id: string; label: string } & (
  | {
      user: RoomMember
      room?: never
      emoji?: never
      commandProps: MentionNodeAttrs
    }
  | {
      user?: never
      emoji?: never
      room: IHierarchyRoom
      commandProps: MentionNodeAttrs & { room: IHierarchyRoom; via: string[] | undefined }
    }
  | {
      user?: never
      emoji: PickerEmoji
      room?: never
      commandProps: EmojiNodeAttrs
    }
)

export function useRoomInput(roomInput: MaybeRefOrGetter<Room>, spaceInput?: MaybeRefOrGetter<Room | undefined>) {
  const room = toRef(roomInput)
  const space = toRef(spaceInput)

  const content = shallowRef('')

  const { onType } = useRoomMembersTyping(room)

  const { contains } = useFilter({ sensitivity: 'base' })

  const { client } = useMatrixClient()
  const { members } = useRoomMembers(room)
  const { rooms } = useSpaceHierarchy(() => space.value?.roomId)

  const roomsArray = computed(() => (rooms.value ? rooms.value.values().toArray() : []))

  const viaByRoomId = computed(() => {
    const roomSpace = rooms.value?.get(space.value?.roomId ?? '')
    if (!roomSpace) return new Map<string, string[]>()
    return new Map(roomSpace.children_state.filter(c => c.content.via?.length).map(c => [c.state_key, c.content.via]))
  })

  const { emojiData } = useEmojiData()
  const { allEmojiPacks } = useUserImagePacks()

  const suggestionEmojis = computed(() => {
    const custom = allEmojiPacks.value.flatMap(fromImagePack)
    const unicode = (emojiData.value?.emojis ?? []).map(fromCompactEmoji)
    return [...custom, ...unicode]
  })

  const open = shallowRef(false)
  const highlightedIdx = shallowRef(0)
  const filteredItems = shallowRef<SuggestionItem[]>([])
  let command: ((props: MentionNodeAttrs) => void) | undefined

  const listHeight = computed(() => Math.min(filteredItems.value.length, 7) * 32)

  const { sendTextMessage } = useRoomMessaging(room)

  function selectItem(item: SuggestionItem) {
    command?.(item.commandProps as MentionNodeAttrs)
  }

  function createSuggestion(
    char: string,
    getItems: (props: { query: string; editor: Editor }) => SuggestionItem[],
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

  const editor = useEditor({
    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain')
        if (!text) return false

        const { schema, tr } = view.state
        const nodes: Node[] = []
        const lines = text.split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (i > 0) nodes.push(schema.nodes.hardBreak!.create())
          if (lines[i]) nodes.push(schema.text(lines[i]!))
        }
        tr.replaceSelection(new Slice(Fragment.from(nodes), 0, 0))
        view.dispatch(tr)
        return true
      },
    },
    extensions: [
      TiptapStarterKit.configure({
        blockquote: false,
        bold: false,
        bulletList: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        italic: false,
        link: false,
        listItem: false,
        orderedList: false,
        strike: false,
        trailingNode: false,
        underline: false,
      }),
      EmojiNode.configure({
        resolveImageUrl: url =>
          resolveImageUrl(url, {
            allowDirectLinks: true,
            baseUrl: client.value.getHomeserverUrl(),
            resizeMethod: 'scale',
            size: 'small',
          }),
        suggestion: createSuggestion(
          ':',
          ({ query }) =>
            suggestionEmojis.value
              .filter(e => contains(e.terms, query))
              .slice(0, 50)
              .map(e => ({
                commandProps: getEmojiNodeAttrs(e),
                emoji: e,
                id: e.key,
                label: e.type === 'unicode' ? e.emoji.unicode : `:${e.shortcode}:`,
              })),
          {
            command: ({ editor, props, range }) => {
              editor
                .chain()
                .focus()
                .insertContentAt(range, [
                  { attrs: props, type: 'emoji' },
                  { text: ' ', type: 'text' },
                ])
                .run()
            },
            shouldOpen: ({ query }) => REGEX__EMOJI_SHORTCODE.test(query),
          },
        ),
      }),
      Mention.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            via: { default: null },
          }
        },
      }).configure({
        suggestions: [
          createSuggestion('#', ({ query }) =>
            roomsArray.value
              .filter(r => r.name && contains(r.name, query))
              .map(r => ({
                commandProps: {
                  id: r.room_id,
                  label: r.name ?? r.room_id,
                  room: r,
                  via: viaByRoomId.value.get(r.room_id),
                },
                id: r.room_id,
                label: r.name ?? r.room_id,
                room: r,
              })),
          ),
          createSuggestion('@', ({ query }) =>
            (members.value ?? [])
              .filter(u => [resolveUserName(u), u.userId].some(v => contains(v, query)))
              .map(u => ({
                commandProps: { id: u.userId, label: resolveUserName(u) },
                id: u.userId,
                label: resolveUserName(u),
                user: u,
              })),
          ),
        ],
      }),
      InlineMarks,
      Placeholder.configure({
        placeholder: () => `Message ${room.value?.name}`,
      }),
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Enter: ({ editor }) => {
              if (open.value) return false

              const mentionedUserIds = new Set<string>()
              editor.state.doc.descendants(node => {
                if (node.type.name === 'mention') {
                  const id = node.attrs.id as string
                  if (isUserId(id)) mentionedUserIds.add(id)
                }
              })

              const plainBody = nodeToPlainBody(editor.state.doc)
              if (!plainBody.trim()) return false

              const md = docToMarkdown(editor.state.doc, client.value)
              const html = (MARKED_INSTANCE.parse(md) as string).trimEnd()
              const sanitizedFormattedBody = sanitizeFormattedBody(html)

              sendTextMessage(plainBody, sanitizedFormattedBody, mentionedUserIds)

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
      if (content.value.trim()) {
        onType()
      } else {
        onType(true)
      }
    },
  })

  watch(room, () => {
    editor.value?.view.dispatch(editor.value.view.state.tr)
  })

  const { hasOpenDialog } = useGlobalDialog()
  onStartTyping(e => {
    if (!hasOpenDialog.value) editor.value?.chain().focus('end').insertContent(e.key).run()
  })

  return {
    inputContent: content,
    inputEditor: editor,
    inputHighlightedSuggestionItem: highlightedIdx,
    inputSuggestionItems: filteredItems,
    inputSuggestionListHeight: listHeight,
    inputSuggestionListOpen: open,
    selectInputSuggestionItem: selectItem,
  }
}
