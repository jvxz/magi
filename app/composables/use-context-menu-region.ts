export interface ContextMenuRegionApi<T = unknown> {
  open: Ref<boolean>
  reference: Ref<VirtualElement | undefined>
  payload: Ref<T | undefined>
  openAt: (event: MouseEvent | PointerEvent, payload: T) => void
  close: () => void
}

export const CONTEXT_MENU_REGION_KEY = Symbol('context-menu-region')

export function createPointReference(point: { clientX: number; clientY: number }): VirtualElement {
  const { clientX: x, clientY: y } = point

  const rect: ClientRectObject = { bottom: y, height: 0, left: x, right: x, top: y, width: 0, x, y }
  return { getBoundingClientRect: () => rect }
}

const CONTEXT_MENU_OPEN_ATTR = 'data-context-menu-open'
export function setContextMenuOpenAttr(el: MaybeElement, action: 'add' | 'remove') {
  if (!(el instanceof HTMLElement)) return

  if (action === 'add') el.setAttribute(CONTEXT_MENU_OPEN_ATTR, '')
  else el.removeAttribute(CONTEXT_MENU_OPEN_ATTR)
}

export function useContextMenuRegion<T = unknown>(): ContextMenuRegionApi<T> {
  const api = inject(CONTEXT_MENU_REGION_KEY)
  if (!api) throw new Error('useContextMenuRegion() must be used inside <UContextMenuRoot>')

  return api as ContextMenuRegionApi<T>
}
