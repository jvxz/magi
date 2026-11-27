import { fromUnicodeToHexcode, fromHexcodeToCodepoint, fromCodepointToUnicode } from 'emojibase'
import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json'

const dataset: Record<string, string | string[]> = shortcodes

export function getUnicodeFromHexcode(hexcode: string) {
  return fromCodepointToUnicode(fromHexcodeToCodepoint(hexcode))
}

export function getUnicodeFromCodepoint(codepoint: string | number[]) {
  if (!isString(codepoint)) return fromCodepointToUnicode(codepoint)
  return fromCodepointToUnicode([Number(codepoint)])
}

export function getHexcodeFromUnicode(unicode: string) {
  return fromUnicodeToHexcode(unicode)
}

export function getShortcodesFromUnicode(unicode: string) {
  const maybeArr = dataset[getHexcodeFromUnicode(unicode)] ?? []
  return toArray(maybeArr)
}

export function isEmojiHexcode(input: string): boolean {
  return REGEX__EMOJI_HEXCODE.test(input)
}

export function isEmojiCodepoint(input: string): boolean {
  return REGEX__EMOJI_CODEPOINT.test(input)
}

export function isEmoji(input: string): boolean {
  return REGEX__EMOJI_STRICT.test(input)
}
