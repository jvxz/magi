export type MaybeElement = HTMLElement | null | undefined
export type ElementOrDimensions = HTMLElement & {
  scrollTop: number
  scrollHeight: number
  clientHeight: number
  offsetTop: number
}

export const rAF = () => new Promise(r => requestAnimationFrame(r))

export function scrollToBottom(el: MaybeElement) {
  if (!el)
    return

  el.scrollTo({
    behavior: 'instant',
    top: el.scrollHeight,
  })
}

export function getIntersectingNodes(el: MaybeElement, padHeight?: number, overrides?: { containerScrollTop?: number, containerClientHeight?: number }) {
  if (!el)
    return

  const containerCanScroll = canElementScroll(el)
  if (!containerCanScroll)
    return Array.from(el.children).filter(c => !c.hasAttribute('data-ignore')) as HTMLElement[]

  const containerScrollTop = overrides?.containerScrollTop ?? el.scrollTop
  const containerClientHeight = overrides?.containerClientHeight ?? el.clientHeight

  const children = el.children
  const intersecting: HTMLElement[] = []
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as HTMLElement | undefined
    if (!child || child.hasAttribute('data-ignore'))
      continue

    if (isIntersecting({ clientHeight: containerClientHeight, scrollTop: containerScrollTop }, child, padHeight))
      intersecting.push(child)
  }

  return intersecting
}

export function canElementScroll(el: MaybeElement) {
  if (!el)
    return false

  return el.scrollHeight > el.offsetHeight
}

export const getScrollBottom = (el: HTMLElement) => el.clientHeight + el.scrollTop

export function isIntersecting(vpEl: Pick<ElementOrDimensions, 'clientHeight' | 'scrollTop'>, childEl: HTMLElement, padHeight?: number) {
  const top = childEl.offsetTop
  const bottom = top + Math.max(childEl.offsetHeight, childEl.offsetHeight + (padHeight ?? 0))

  const viewTop = vpEl.scrollTop
  const viewBottom = viewTop + Math.max(vpEl.clientHeight, vpEl.clientHeight + (padHeight ?? 0))

  return bottom > viewTop && top < viewBottom
}

type DimensionsWithDataset = Pick<ElementOrDimensions, 'clientHeight'> & { dataset: HTMLElement['dataset'] }

export function getTotalNodeHeights<T extends ChildNode | HTMLElement | DimensionsWithDataset>(
  nodes: T[],
  initHeight?: number,
  calcWhile?: (currentHeight: number) => boolean,
  onCalc?: (node: T) => void,
) {
  let currentHeight = initHeight ?? 0
  const scannedNodes: T[] = []

  for (let i = 0; i < nodes.length; i++) {
    if (calcWhile && !calcWhile?.(currentHeight))
      break

    const node = nodes[i]
    if (!node || !('clientHeight' in node))
      continue

    if (node instanceof HTMLElement && node.hasAttribute('data-ignore'))
      continue

    onCalc?.(node)

    currentHeight += node.clientHeight
    scannedNodes.push(node)
  }

  return {
    scannedNodes,
    totalHeights: currentHeight,
  }
}
