import { upperFirst, words } from 'es-toolkit/string'
import { parseFilename } from 'ufo'

import { REGEX__ALPHANUMERIC } from '../constants/regex'

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

  return REGEX__ALPHANUMERIC.test(extension) ? extension : null
}

export const handlePlural = (numberOrIter: number | Set<any> | any[], pluralString: string, singularString: string) => {
  let len: number

  if (numberOrIter instanceof Set) {
    len = numberOrIter.size
  } else if (Array.isArray(numberOrIter)) {
    len = numberOrIter.length
  } else {
    len = numberOrIter
  }

  return len === 1 ? singularString : pluralString
}
