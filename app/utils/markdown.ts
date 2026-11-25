import type { EmojiItem, EmojiOptions } from '@tiptap/extension-emoji'
import type { Node } from '@tiptap/pm/model'
import type { TokenizerAndRendererExtension } from 'marked'
import type { Token } from 'marked'

import { Extension, InputRule, mergeAttributes, PasteRule } from '@tiptap/core'
import { Emoji } from '@tiptap/extension-emoji'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Marked } from 'marked'
import { Decoration, DecorationSet } from 'prosemirror-view'

const underlineExt: TokenizerAndRendererExtension = {
  level: 'inline',
  name: 'underline',
  renderer(token) {
    return `<u>${this.parser.parseInline(token.tokens ?? [])}</u>`
  },
  start(src) {
    return src.indexOf('__')
  },
  tokenizer(src) {
    const match = REGEX__UNDERLINE_EXT.exec(src)
    if (!match) return
    return {
      raw: match[0],
      text: match[1],
      tokens: this.lexer.inlineTokens(match[1]!),
      type: 'underline',
    }
  },
}

export const MARKED_INSTANCE = new Marked({ async: false, extensions: [underlineExt] })

export const MARKED_MESSAGE_INSTANCE = new Marked({ async: false, extensions: [underlineExt] })

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

const InlineMarksKey = new PluginKey('inline-marks')
export const InlineMarks = Extension.create({
  addProseMirrorPlugins: () => [
    new Plugin({
      key: InlineMarksKey,
      props: {
        decorations: state => InlineMarksKey.getState(state),
      },
      state: {
        apply: (tr, old) => (tr.docChanged ? build(tr.doc) : old),
        init: (_, { doc }) => build(doc),
      },
    }),
  ],
  name: 'inline-marks',
})

function build(doc: Node): DecorationSet {
  const decos: Decoration[] = []

  doc.descendants((node, pos, parent) => {
    if (!node.isText || !node.text || parent?.type.spec.code) return
    const tokens = MARKED_INSTANCE.Lexer.lexInline(node.text, MARKED_INSTANCE.defaults)
    walk(tokens, pos, decos)
  })

  return DecorationSet.create(doc, decos)
}

const CLASSES = {
  codespan: 'md-codespan',
  del: 'md-strikethrough',
  em: 'md-em',
  strong: 'md-strong',
  underline: 'md-underline',
}

function walk(tokens: Token[], pos: number, decos: Decoration[]) {
  let offset = pos
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]
    if (!token) continue
    if (!('text' in token) || !isString(token.text)) continue

    const type = token.type
    const end = offset + token.raw.length

    if (type === 'codespan') {
      decos.push(Decoration.inline(offset, end, { class: 'md-codespan' }))
    } else if (type === 'link') {
      const textStart = offset + 1
      const textEnd = textStart + token.text.length

      decos.push(Decoration.inline(offset, textStart, { class: 'md-marker' }))
      decos.push(Decoration.inline(textStart, textEnd, { class: 'md-link' }))
      decos.push(Decoration.inline(textEnd, end, { class: 'md-marker' }))

      if (token.tokens?.length) walk(token.tokens, textStart, decos)
    } else {
      const cls = CLASSES[type as keyof typeof CLASSES]

      if (cls) {
        const markerLen = (token.raw.length - token.text.length) / 2
        const contentStart = offset + markerLen
        const contentEnd = offset + token.raw.length - markerLen

        decos.push(Decoration.inline(offset, contentStart, { class: 'md-marker' }))
        decos.push(Decoration.inline(contentStart, contentEnd, { class: cls }))
        decos.push(Decoration.inline(contentEnd, offset + token.raw.length, { class: 'md-marker' }))

        if ('tokens' in token && !!token.tokens) walk(token.tokens, contentStart, decos)
      }
    }

    offset += token.raw.length
  }

  return offset
}
