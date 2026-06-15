export interface ContextMenuRegionApi<T = unknown> {
  open: Ref<boolean>
  reference: Ref<VirtualElement | undefined>
  payload: Ref<T | undefined>
  openAt: (event: MouseEvent | PointerEvent, payload: T) => void
  close: () => void
}

const contextMenuMap = new Map<ContextMenuName, InjectionKey<ContextMenuRegionApi<unknown>>>()
export function getContextMenuKey<T extends ContextMenuName>(name: T) {
  let key = contextMenuMap.get(name)
  if (!key) {
    key = Symbol(`context-menu:${name}`)
    contextMenuMap.set(name, key)
  }
  return key
}

export function useContextMenuRegion<T extends ContextMenuName>(name: T) {
  const api = inject(getContextMenuKey(name))
  if (!api) throw new Error('useContextMenuRegion() must be used inside <UContextMenuRegionRoot>')

  return api as ContextMenuRegionApi<ContextMenuRegions[T]>
}

const CONTEXT_MENU_OPEN_ATTR = 'data-context-menu-open'
export function setContextMenuOpenAttr(el: MaybeElement, action: 'add' | 'remove') {
  if (!(el instanceof HTMLElement)) return

  if (action === 'add') el.setAttribute(CONTEXT_MENU_OPEN_ATTR, '')
  else el.removeAttribute(CONTEXT_MENU_OPEN_ATTR)
}
