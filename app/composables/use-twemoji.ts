import twemoji from '@twemoji/api'

type TwemojiFn<T> = (
  input:
    | string
    | {
        unicode: string
        hexcode?: never
      }
    | {
        hexcode: string
        unicode?: never
      },
) => T

export const useTwemoji = createGlobalState(() => {
  const resolveTwemojiUrl: TwemojiFn<string | undefined> = input => {
    let unicode: string | undefined

    if (isString(input)) {
      if (isEmojiHexcode(input)) unicode = getUnicodeFromHexcode(input)
      else if (isEmojiCodepoint(input))
        unicode = twemoji.convert.fromCodePoint(input.replace(REGEX__EMOJI_HEXCODE_UPLUS, ''))
      else if (isEmoji(input)) unicode = input
    } else if (input.hexcode) unicode = getUnicodeFromHexcode(input.hexcode)
    else if (input.unicode) unicode = input.unicode

    if (!unicode) return

    return twemoji.parse(unicode, { ext: '.svg', folder: 'svg' }).match(REGEX__SRC_URL)?.[1]
  }

  const getTwemojiUrl: TwemojiFn<string | undefined> = input => {
    return resolveTwemojiUrl(input)
  }

  return { getTwemojiUrl }
})
