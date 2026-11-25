import type { MentionNodeAttrs } from '@tiptap/extension-mention'
import type { Node } from '@tiptap/pm/model'
import type { Token } from 'marked'

export function nodeToPlainBody(node: Node): string {
  if (node.isText) return inlineMarkdownToText(node.text ?? '')

  switch (node.type.name) {
    case 'hardBreak':
      return '\n'
    case 'mention': {
      const { id, label } = node.attrs as MentionNodeAttrs
      if (!label || label === id) return `${id ?? ''}`
      return `${isUserId(id) ? '@' : '#'}${label}`
    }
    case 'emoji': {
      const { shortcode, unicode, url } = node.attrs as { unicode: string; shortcode?: string; url?: string }
      return url ? `:${shortcode}:` : unicode
    }
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
