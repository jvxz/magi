import type { TokenizerAndRendererExtension } from 'marked'

import { Marked } from 'marked'

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
