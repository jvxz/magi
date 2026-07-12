import { upperFirst, words } from 'es-toolkit/string'
import { parseFilename } from 'ufo'

import { ALPHANUMERIC_RE } from './regex'

export const kebabToSentence = (string: string) => upperFirst(words(string).join(' '))

export const createGenericFilename = () => `magi-${Date.now()}`

export function getFileExtension(value: string) {
  if (!value.trim()) {
    return null
  }

  let filename = parseFilename(value) ?? ''

  try {
    filename = decodeURIComponent(filename)
  } catch {}

  const dotIndex = filename.lastIndexOf('.')

  if (dotIndex <= 0 || dotIndex === filename.length - 1) {
    return null
  }

  const extension = filename.slice(dotIndex + 1).toLowerCase()

  return ALPHANUMERIC_RE.test(extension) ? extension : null
}
