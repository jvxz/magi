import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Node } from '@tiptap/pm/model'
import type { RoomMember } from 'matrix-js-sdk'
import type { Room } from 'matrix-js-sdk'
import type { IHierarchyRoom } from 'matrix-js-sdk/lib/@types/spaces'

import { Extension } from '@tiptap/core'
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

  const { createSuggestion, filteredItems, highlightedIdx, listHeight, open, selectItem } =
    useEditorSuggestions<SuggestionItem>()

  const { sendTextMessage } = useRoomMessaging(room)

  const editor = useEditor({
    editorProps: {
      handlePaste(view, event) {
        const text = event.clipboardData?.getData('text/plain')
        if (!text) return false

        const { schema, tr } = view.state
        const nodes: Node[] = []
        const lines = text.split('\n')

        // handle hard breaks
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
      EditorStarterKit,

      // emoji suggestions
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

      // mention suggestions
      MentionNode.configure({
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

      // styling for formatting (underlines, bold, italic, etc)
      InlineMarks,

      // placeholder
      Placeholder.configure({
        placeholder: () => `Message ${room.value.name}`,
      }),

      // keyboard interactions
      Extension.create({
        addKeyboardShortcuts() {
          return {
            Enter: ({ editor }) => {
              if (open.value) return false

              const { body, formattedBody, mentionedUserIds } = serializeDoc(editor.state.doc, client.value)
              if (!body.trim()) return false

              sendTextMessage(body, formattedBody, mentionedUserIds)

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

    // typing status
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
