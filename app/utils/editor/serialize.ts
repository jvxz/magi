import type { Node } from '@tiptap/pm/model'
import type { Token } from 'marked'
import type { MatrixClient } from 'matrix-js-sdk'

import { escape } from 'es-toolkit'

export interface SerializedDoc {
  body: string
  formattedBody: string
  mentionedUserIds: Set<string>
}

export function serializeDoc(doc: Node, client: MatrixClient): SerializedDoc {
  const mentionedUserIds = new Set<string>()
  doc.descendants(node => {
    if (node.type.name !== 'mention') return
    const id = node.attrs.id as string
    if (isUserId(id)) mentionedUserIds.add(id)
  })

  const html = (MARKED_INSTANCE.parse(docToMarkdown(doc, client)) as string).trimEnd()
  const formattedBody = sanitizeFormattedBody(html)
    // strip the wrapping <p> marked adds
    .replace(REGEX__P_TAG, '$1')
    .trimEnd()

  return { body: nodeToPlainBody(doc).trimEnd(), formattedBody, mentionedUserIds }
}

interface InlineNodeSerializer {
  plain: (node: Node) => string
  markdown: (node: Node, client: MatrixClient) => string
}

const INLINE_NODES: Record<string, InlineNodeSerializer> = {
  emoji: {
    markdown: ({ attrs: { label, shortcode, unicode, url } }) =>
      url
        ? `<img data-mx-emoticon src="${escape(url)}" alt="${escape(label ?? shortcode)}" title="${escape(shortcode)}" height="32">`
        : unicode,
    plain: ({ attrs: { shortcode, unicode, url } }) => (url ? `:${shortcode}:` : unicode),
  },
  hardBreak: {
    markdown: () => '\n',
    plain: () => '\n',
  },
  mention: {
    markdown: ({ attrs: { id, label, via } }, client) => {
      const type: MatrixToUrl['type'] = isUserId(id)
        ? 'userId'
        : isRoomAlias(id)
          ? 'roomAlias'
          : isRoomId(id)
            ? 'roomId'
            : 'unknown'

      const sigil = type === 'userId' ? '@' : '#'
      return `[${sigil}${label}](${getMatrixToUrl(client, type, id, { viaServers: via })})`
    },
    plain: ({ attrs: { id, label } }) => {
      if (!label || label === id) return `${id ?? ''}`
      return `${isUserId(id) ? '@' : '#'}${label}`
    },
  },
}

function nodeToPlainBody(node: Node): string {
  if (node.isText) return inlineMarkdownToText(node.text ?? '')

  const inline = INLINE_NODES[node.type.name]
  if (inline) return inline.plain(node)

  if (node.isTextblock) {
    let output = ''
    node.forEach(c => {
      output += nodeToPlainBody(c)
    })
    return output
  }

  const parts: string[] = []
  node.forEach(c => parts.push(nodeToPlainBody(c)))
  return parts.join('\n')
}

function inlineMarkdownToText(text: string): string {
  if (!text) return ''
  const tokens = MARKED_INSTANCE.Lexer.lexInline(text, MARKED_INSTANCE.defaults)
  return inlineTokensToText(tokens)
}

function inlineTokensToText(tokens: Token[]): string {
  let output = ''
  for (const token of tokens) {
    if (token.type === 'br') output += '\n'
    else if (token.type === 'codespan') output += token.text
    else if ('tokens' in token && token.tokens?.length) output += inlineTokensToText(token.tokens)
    else if ('text' in token && isString(token.text)) output += token.text
    else output += token.raw
  }
  return output
}

function docToMarkdown(doc: Node, client: MatrixClient): string {
  let out = ''
  doc.descendants((node, _pos, parent) => {
    if (parent?.type.name === 'doc') return
    out += node.isText ? node.text : (INLINE_NODES[node.type.name]?.markdown(node, client) ?? '')
    return false
  })
  return out
}
