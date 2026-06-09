import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Node } from '@tiptap/pm/model'
import type { Token } from 'marked'

import { escape } from 'es-toolkit'

export function nodeToPlainBody(node: Node): string {
  if (node.isText) return inlineMarkdownToText(node.text ?? '')

  switch (node.type.name) {
    case 'hardBreak':
      return '\n'
    case 'mention': {
      const attrs = node.attrs as MentionNodeAttrs
      const prefix = String(attrs.id).startsWith('!') ? '#' : '@'
      return `${prefix}${attrs.label ?? ''}`
    }
    case 'emoji':
      return (node.attrs as { unicode: string }).unicode
    case 'codeBlock':
      return node.textContent
  }

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
    case 'paragraph':
      return `<p>${childrenToHtml(node)}</p>`
    case 'bulletList':
      return `<ul>${childrenToHtml(node)}</ul>`
    case 'orderedList':
      return `<ol>${childrenToHtml(node)}</ol>`
    case 'listItem':
      return `<li>${childrenToHtml(node)}</li>`
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
