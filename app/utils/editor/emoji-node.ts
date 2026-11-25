import type { EmojiItem, EmojiOptions } from '@tiptap/extension-emoji'

import { InputRule, mergeAttributes, PasteRule } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'

function findEmojiByShortcode(shortcode: string, emojis: EmojiItem[]) {
  return emojis.find(e => e.name === shortcode || e.shortcodes?.includes(shortcode))
}

export interface EmojiNodeOptions extends EmojiOptions {
  // handles custom emojis
  resolveImageUrl: ((mxcUrl: string) => string | undefined) | undefined
}

export interface EmojiNodeAttrs {
  hexcode?: string | null
  label: string | null
  unicode?: string | null
  shortcode?: string | null
  url?: string | null
}

export const EmojiNode = Emoji.extend<EmojiNodeOptions>({
  addAttributes: () => ({
    hexcode: { default: null },
    label: { default: null },
    shortcode: { default: null },
    unicode: { default: null },
    url: { default: null },
  }),
  addInputRules() {
    return [
      new InputRule({
        find: REGEX__SHORTCODE_INPUT,
        handler: ({ chain, match, range }) => {
          const item = findEmojiByShortcode(match[1]!, this.options.emojis)
          if (!item?.emoji) return
          chain()
            .insertContentAt(range, { attrs: { label: item.name, unicode: item.emoji }, type: this.name })
            .run()
        },
      }),
    ]
  },
  addOptions() {
    return { ...this.parent!(), resolveImageUrl: undefined }
  },
  addPasteRules() {
    return [
      new PasteRule({
        find: REGEX__SHORTCODE_PASTE,
        handler: ({ chain, match, range }) => {
          const item = findEmojiByShortcode(match[2]!, this.options.emojis)
          if (!item?.emoji) return
          const from = range.from + (match[1]?.length ?? 0)
          chain()
            .insertContentAt(
              { from, to: range.to },
              { attrs: { label: item.name, unicode: item.emoji }, type: this.name },
              { updateSelection: false },
            )
            .run()
        },
      }),
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    const { label, shortcode, url } = node.attrs
    if (url) {
      return [
        'img',
        mergeAttributes(HTMLAttributes, {
          alt: label ?? shortcode,
          class: 'select-auto inline h-1lh',
          'data-type': this.name,
          src: this.options.resolveImageUrl?.(url),
          title: `:${shortcode}:`,
        }),
      ]
    }

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        class: 'select-auto',
        'data-type': this.name,
      }),
      node.attrs.unicode ?? '',
    ]
  },
  renderText: ({ node }) => (node.attrs.url ? `:${node.attrs.shortcode}:` : (node.attrs.unicode ?? '')),
})
