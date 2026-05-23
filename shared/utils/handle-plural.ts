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
