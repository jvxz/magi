import { flatCase, splitByCase, upperFirst } from 'scule'

export function kebabToSentence(kebab: string) {
  return upperFirst(splitByCase(kebab).map(flatCase).join(' '))
}
