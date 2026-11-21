import { fromUnicodeToHexcode, fromHexcodeToCodepoint, fromCodepointToUnicode } from 'emojibase'
import shortcodes from 'emojibase-data/en/shortcodes/joypixels.json'

const dataset: Record<string, string | string[]> = shortcodes

export function getUnicodeFromHexcode(hexcode: string) {
  return fromCodepointToUnicode(fromHexcodeToCodepoint(hexcode))
}

export function getHexcodeFromUnicode(unicode: string) {
  return fromUnicodeToHexcode(unicode)
}

export function getShortcodeFromUnicode(unicode: string) {
  const maybeArr = dataset[getHexcodeFromUnicode(unicode)]
  return Array.isArray(maybeArr) ? maybeArr[0] : maybeArr
}
