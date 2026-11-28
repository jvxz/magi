import type { CompactEmoji } from 'emojibase'

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

export function getEmojiKey(scopeId: string, emoji: Emoji) {
  return `${scopeId}-${emoji.key}`
}

export function fromCompactEmoji(emoji: CompactEmoji): Extract<Emoji, { type: 'unicode' }> {
  return {
    // resolve unknown groups to symbols category (8)
    group: emoji.group ?? 8,
    hexcode: emoji.hexcode,
    key: emoji.hexcode,
    label: emoji.label,
    shortcodes: getShortcodesFromUnicode(emoji.unicode),
    terms: [emoji.label, ...(emoji.tags ?? [])].join(' '),
    type: 'unicode',
    unicode: emoji.unicode,
  }
}

export function fromImagePackImage(packId: string, shortcode: string, image: ImagePackImage): Emoji {
  return {
    key: `${packId}/${shortcode}`,
    label: shortcode,
    packId,
    shortcode,
    terms: image.body ? `${shortcode} ${image.body}` : shortcode,
    type: 'custom',
    url: image.url,
  }
}

export function fromImagePack(pack: ImagePack): Emoji[] {
  return objectEntries(pack.images).map(([shortcode, image]) => fromImagePackImage(pack.id, shortcode, image))
}

export function emojiListToMap(emojis: Emoji[]) {
  const map = new Map<string, Emoji>()
  for (const emoji of emojis) {
    map.set(emoji.key, emoji)
  }
  return map
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

export function resolveEmojiReadableName(emoji: Emoji) {
  if (emoji.type === 'custom') return emoji.label
  return getShortcodesFromUnicode(emoji.unicode)[0]
}
