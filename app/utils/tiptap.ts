import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Node } from '@tiptap/pm/model'

import { escape } from 'es-toolkit'

export function nodeToFormattedBody(node: Node) {
  if (node.isText) return MARKED_INSTANCE.parseInline(node.text ?? '') as string

  switch (node.type.name) {
    case 'hardBreak':
      return '<br/>'
    case 'mention':
      return mentionToHtml(node)
    case 'emoji':
      return emojiToHtml(node)
    case 'blockquote':
      return blockquoteToHtml(node)
    case 'codeBlock':
      return codeBlockToHtml(node)
    default:
      return childrenToHtml(node)
  }
}

function codeBlockToHtml(node: Node) {
  const { language } = node.attrs as { language?: string | null }
  const langAttr = language ? ` class="language-${escape(language)}"` : ''
  return `<pre><code${langAttr}>${escape(node.textContent)}</code></pre>`
}

function mentionToHtml(node: Node) {
  const attrs = node.attrs as MentionNodeAttrs
  const prefix = String(attrs.id).startsWith('!') ? '#' : '@'
  return `<a href="https://matrix.to/#/${encodeURIComponent(String(attrs.id))}">${prefix}${escape(attrs.label ?? '')}</a>`
}

function emojiToHtml(node: Node) {
  const attrs = node.attrs as { unicode: string }
  return `<span>${attrs.unicode}</span>`
}

function blockquoteToHtml(node: Node) {
  return `<blockquote>${childrenToHtml(node)}</blockquote>`
}

function childrenToHtml(node: Node) {
  let output = ''
  node.forEach(c => {
    output += nodeToFormattedBody(c)
  })
  return output
}
