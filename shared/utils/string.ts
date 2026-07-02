import { upperFirst, words } from 'es-toolkit/string'

export const kebabToSentence = (string: string) => upperFirst(words(string).join(' '))
