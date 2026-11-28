import type { EmojiOptions } from '@tiptap/extension-emoji'

import { InputRule, mergeAttributes, PasteRule } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'

export interface EmojiNodeOptions extends EmojiOptions {
  // handles custom emojis
  resolveImageUrl: ((mxcUrl: string) => string | undefined) | undefined
  findEmoji: ((shortcode: string) => EmojiNodeAttrs | undefined) | undefined
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
          const attrs = this.options.findEmoji?.(match[1]!)
          if (!attrs) return
          chain().insertContentAt(range, { attrs, type: this.name }).run()
        },
      }),
    ]
  },
  addOptions() {
    return { ...this.parent!(), findEmoji: undefined, resolveImageUrl: undefined }
  },
  addPasteRules() {
    return [
      new PasteRule({
        find: REGEX__SHORTCODE_PASTE,
        handler: ({ chain, match, range }) => {
          const attrs = this.options.findEmoji?.(match[2]!)
          if (!attrs) return
          const from = range.from + (match[1]?.length ?? 0)
          chain().insertContentAt({ from, to: range.to }, { attrs, type: this.name }, { updateSelection: false }).run()
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
