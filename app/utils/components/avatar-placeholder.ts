// MIT https://github.com/boringdesigners/boring-avatars
export function hashCode(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const character = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + character
    hash = hash & hash
  }
  return Math.abs(hash)
}

export function getRandomColor(number: number, colors: string[], range: number): string {
  return colors[(number) % range] as string
}

export function getUnit(number: number, range: number, index?: number): number {
  const value = number % range

  if (index && ((getDigit(number, index) % 2) === 0))
    return -value
  else return value
}

export function getDigit(number: number, ntn: number): number {
  return Math.floor((number / 10 ** ntn) % 10)
}
