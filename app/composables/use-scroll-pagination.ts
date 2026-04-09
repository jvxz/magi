import { toRef } from '@vueuse/core'

type MaybeElementRef = MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>
type Direction = 'forward' | 'backward'

interface FnParams<T extends object> {
  dir: Direction
  startItem: T
  endItem: T
  listPaginated: T[]
  isOnLatestPage: boolean
}

type OptsCanPaginate<T extends object>
  = ((params: FnParams<T>) => boolean | { backward: boolean, forward: boolean })
    | MaybeRef<boolean>
    | { backward: MaybeRef<boolean>, forward: MaybeRef<boolean> }

type Opts<T extends object> = Prettify<Partial<{
  onBeforePaginate: (params: FnParams<T>) => T[] | undefined | void | Promise<T[] | undefined | void>
  onPaginate: (params: FnParams<T>) => void | undefined
  windowSize: MaybeRefOrGetter<number>
  canPaginate: OptsCanPaginate<T>
  bottomAnchor: MaybeElementRef
  maxItems: MaybeRefOrGetter<number>
  overscanSize: MaybeRefOrGetter<number>
  customItemsContainer: MaybeElementRef
  key: string
}> & {
  identifier: keyof T
}>

export function useScrollPagination<T extends object>(list: Ref<T[]>, container: MaybeElementRef, options: Opts<T>) {
  type Identifier = typeof options.identifier

  const maxItems = refDefault(toRef(options.maxItems), 80)
  const listPaginated = shallowRef<T[]>(list.value.slice(-maxItems.value))
  const isReady = shallowRef(false)
  const isPaginating = shallowRef(false)
  const isOnLatestPage = computed(() => {
    const lastPaginated = listPaginated.value.at(-1)
    const lastList = list.value.at(-1)
    if (!lastPaginated || !lastList)
      return false
    return getItemIdentifier(lastPaginated) === getItemIdentifier(lastList)
  })

  const containerRef = toRef(container)
  const bottomAnchorRef = toRef(options.bottomAnchor)
  const customItemsContainer = toRef(options.customItemsContainer)
  const containerScrollTop = shallowRef(0)

  const windowSize = refDefault(toRef(options.windowSize), 8000)
  const windowSectionSize = computed(() => windowSize.value / 3)
  const overscanSize = refDefault(toRef(options.overscanSize), windowSize.value / 12.5)

  // const pageStartItemId = useState<Identifier>(options.key ? `room:pageStartItemId:${options.key}` : undefined)
  // const pageEndItemId = useState<Identifier>(options.key ? `room:pageEndItemId:${options.key}` : undefined)
  const pageStartItemId = shallowRef<Identifier>()
  const pageEndItemId = shallowRef<Identifier>()
  const lastItemId = computed(() => getItemIdentifier(last(list.value)!) as Identifier)
  const itemListIndexMap = computed(() => {
    const map = new Map<string, number>()
    for (let i = 0; i < list.value.length; i++)
      map.set(getItemIdentifier(list.value[i]), i)

    return map
  })

  watch(() => list.value.at(-1), (newLastItem, oldLastItem) => {
    assert(pageStartItemId.value, 'pageStartItemId was undefined when attempting to paginate forwards on list update')

    const includedLastItem = oldLastItem ? listPaginated.value.includes(oldLastItem) : true
    if (includedLastItem) {
      if (!newLastItem)
        return

      const newLastItemId = getItemIdentifier(newLastItem) as Identifier
      paginate('forward', pageStartItemId.value, newLastItemId)
    }
  })

  useScroll(containerRef, { onScroll })

  const itemBind = (item: T, index: number) => ({
    'data-index': index,
    'data-item-id': getItemIdentifier(item),
  })

  onMounted(async () => {
    await nextTick()
    const container = getContainer()
    assert(container, 'container not found')

    if (!bottomAnchorRef.value) {
      const bottomAnchorEl = document.createElement('div')
      bottomAnchorEl.style.height = '0px'

      const bottomAnchorElAppended = container.appendChild(bottomAnchorEl)

      bottomAnchorRef.value = bottomAnchorElAppended
    }

    scrollToBottom()

    const nodes = getChildNodes()
    for (const node of nodes) {
      if (!(node instanceof HTMLDivElement) || !node.dataset.index || !node.dataset.itemId)
        continue

      if (Math.abs(node.offsetTop - container.scrollHeight) <= windowSize.value) {
        const id = node.dataset.itemId
        const item = getItemByIdentifier(id as Identifier)

        if (item) {
          if (container.scrollHeight > windowSize.value) {
            const fullIdx = getItemListIndex(item)
            const start = Math.max(0, fullIdx - maxItems.value + 1)
            listPaginated.value = list.value.slice(start, fullIdx + 1)
          }
          pageStartItemId.value = id as Identifier
        }
        break
      }
    }

    await nextTick()
    isReady.value = true
  })

  async function paginate(dir: Direction, startItemId: Identifier, endItemId: Identifier) {
    if (isPaginating.value)
      return

    const { backward: canPaginateBackward, forward: canPaginateForward } = canPaginate(dir)
    if (dir === 'backward' && !canPaginateBackward)
      return
    if (dir === 'forward' && (!canPaginateForward || isOnLatestPage.value))
      return

    const container = unrefElement(containerRef)
    if (!container)
      return

    isPaginating.value = true
    try {
      const startItem = getItemByIdentifier(startItemId)
      const endItem = getItemByIdentifier(endItemId)
      assert(startItem, 'startItem does not exist')
      assert(endItem, 'endItem does not exist')

      if (dir === 'backward') {
        const prevHeight = container.scrollHeight
        const scrollTopAtPaginateStart = container.scrollTop

        const anchorId = getItemIdentifier(listPaginated.value[0])
        const anchorEl = anchorId ? container.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(anchorId)}"]`) : null

        const visibleAnchorEl = getFirstVisibleNode()
        const visibleAnchorId = visibleAnchorEl?.dataset.itemId ?? null
        const visibleAnchorOffset = visibleAnchorEl ? visibleAnchorEl.offsetTop - container.scrollTop : null

        const restoreAnchorId = visibleAnchorId ?? anchorId
        const restoreAnchorOffset = visibleAnchorOffset ?? (anchorEl ? anchorEl.offsetTop - container.scrollTop : 0)

        const items = await options?.onBeforePaginate?.(makeFnParams({ dir, endItem, startItem }))
        if (items)
          listPaginated.value = items

        await nextTick()

        const newHeight = container.scrollHeight
        const addedHeight = newHeight - prevHeight

        const expectedScrollTopBeforeRestore = scrollTopAtPaginateStart + addedHeight
        const rawUserScrollDeltaWhilePaginating = container.scrollTop - expectedScrollTopBeforeRestore
        const shouldIgnoreUserDeltaAtTop = container.scrollTop === 0 && addedHeight > 0

        const userScrollDeltaWhilePaginating = shouldIgnoreUserDeltaAtTop
          ? -scrollTopAtPaginateStart
          : rawUserScrollDeltaWhilePaginating
        if (!addedHeight)
          return

        const topTrimHeight = Math.max(0, addedHeight - windowSectionSize.value)
        const topItemId = getClosestNode(topTrimHeight, true)?.dataset.itemId as Identifier
        const topListItem = getItemByIdentifier(topItemId)
        if (!topListItem)
          throw new Error('no top element found')

        pageStartItemId.value = getItemIdentifier(topListItem) as Identifier

        const bottomTrimHeight = Math.max(0, newHeight - topTrimHeight - windowSize.value)
        const bottomListItem
          = bottomTrimHeight === 0
            ? listPaginated.value.at(-1)
            : getItemByIdentifier(getClosestNode(bottomTrimHeight, false)?.dataset.itemId as Identifier)
        if (!bottomListItem)
          throw new Error('no bottom element found')

        pageEndItemId.value = getItemIdentifier(bottomListItem) as Identifier

        const start = getItemListIndex(topListItem)
        const end = getItemListIndex(bottomListItem) + 1

        listPaginated.value = list.value.slice(start, end)

        await nextTick()
        await rAF()

        if (restoreAnchorId) {
          const newAnchorEl = container.querySelector<HTMLElement>(`[data-item-id="${CSS.escape(restoreAnchorId)}"]`)
          if (newAnchorEl) {
            const restoredScrollTop = newAnchorEl.offsetTop - restoreAnchorOffset
            container.scrollTop = restoredScrollTop + userScrollDeltaWhilePaginating
          }
        }
        containerScrollTop.value = container.scrollTop
      }
      else {
        const items = await options?.onBeforePaginate?.(makeFnParams({ dir, endItem, startItem }))
        if (items)
          listPaginated.value = items

        await nextTick()

        const newHeight = container.scrollHeight

        const topTrimHeight = Math.max(
          0,
          Math.min(
            container.scrollTop - windowSectionSize.value,
            newHeight - windowSize.value,
          ),
        )

        const topItemId = getClosestNode(topTrimHeight, true)?.dataset.itemId as Identifier
        const topListItem = getItemByIdentifier(topItemId)
        if (!topListItem)
          throw new Error('no top element found')

        const bottomTrimHeight = Math.max(0, newHeight - topTrimHeight - windowSize.value)
        const bottomListItem
          = bottomTrimHeight === 0
            ? listPaginated.value.at(-1)
            : getItemByIdentifier(getClosestNode(bottomTrimHeight, false)?.dataset.itemId as Identifier)

        if (!bottomListItem)
          throw new Error('no bottom element found')

        pageStartItemId.value = getItemIdentifier(topListItem) as Identifier
        pageEndItemId.value = getItemIdentifier(bottomListItem) as Identifier

        const start = getItemListIndex(topListItem)
        const end = getItemListIndex(bottomListItem) + 1

        listPaginated.value = list.value.slice(start, end)

        await nextTick()
        await rAF()
      }
    }
    finally {
      isPaginating.value = false
      options?.onPaginate?.(makeFnParams({ dir }))
    }
  }

  function loadOlder() {
    if (!pageStartItemId.value || !canPaginate('backward'))
      return
    return paginate('backward', pageStartItemId.value, pageEndItemId.value ?? lastItemId.value)
  }

  function getClosestNode(height: number, startFromTop = true) {
    const container = unrefElement(containerRef)
    if (!container)
      return

    const scrollHeight = container.scrollHeight
    for (const node of getChildNodes()) {
      if (!(node instanceof HTMLElement) || !node.dataset.index || !node.dataset.itemId)
        continue

      if (startFromTop) {
        if (Math.abs(node.offsetTop) >= height)
          return node
      }
      else {
        if (Math.abs(node.offsetTop - scrollHeight) <= height)
          return node
      }
    }

    throw new Error('didnt get node')
  }

  function getFirstVisibleNode() {
    const container = unrefElement(containerRef)
    if (!container)
      return null

    for (const node of getChildNodes()) {
      if (!(node instanceof HTMLElement) || !node.dataset.index || !node.dataset.itemId)
        continue

      if (node.offsetTop + node.offsetHeight > container.scrollTop)
        return node
    }

    return null
  }

  function onScroll() {
    const container = unrefElement(containerRef)
    if (!container)
      return

    const prevScrollTop = containerScrollTop.value

    const backwardTriggerThreshold = Math.min(overscanSize.value, Math.max(200, container.clientHeight / 3))

    const nearTop = container.scrollTop <= backwardTriggerThreshold
    const nearBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - overscanSize.value

    const isScrollingBackward = container.scrollTop < prevScrollTop
    const isScrollingForward = container.scrollTop > prevScrollTop

    const prevNearBottom = prevScrollTop + container.clientHeight >= container.scrollHeight - overscanSize.value
    const enteredNearTop = nearTop && prevScrollTop > backwardTriggerThreshold && isScrollingBackward
    const enteredNearBottom = nearBottom && !prevNearBottom && isScrollingForward

    if (enteredNearTop && pageStartItemId.value)
      paginate('backward', pageStartItemId.value, pageEndItemId.value ?? lastItemId.value)

    if (enteredNearBottom && pageStartItemId.value)
      paginate('forward', pageStartItemId.value, pageEndItemId.value ?? lastItemId.value)

    containerScrollTop.value = container.scrollTop
  }

  function scrollToBottom() {
    const bottomAnchor = unrefElement(bottomAnchorRef.value)
    assert(bottomAnchor, 'bottomAnchor element not found')

    bottomAnchor.scrollIntoView({ behavior: 'instant', block: 'end' })
    containerScrollTop.value = containerRef.value!.scrollTop
  }

  function getItemIdentifier(item: T | undefined): string {
    if (!item)
      return ''

    const value = item[options.identifier]
    const res = typeof value === 'function'
      ? (value as () => unknown).call(item)
      : value
    return String(res)
  }

  function getItemByIdentifier(id: Identifier | undefined): T | undefined {
    let i = list.value.length
    while (i--) {
      if (getItemIdentifier(list.value[i]) === id)
        return list.value[i]
    }
  }

  function getItemListIndex(item: T) {
    const id = getItemIdentifier(item)
    const index = itemListIndexMap.value.get(id)
    assert(index !== undefined, `could not get full list index for item ${id}`)

    return index
  }

  function getChildNodes() {
    const el = getContainer()

    const nodes = el?.childNodes
    assert(nodes, 'could not get childNodes from element')

    return el.childNodes
  }

  function getContainer() {
    return customItemsContainer.value ? unrefElement(customItemsContainer) : unrefElement(containerRef)
  }

  function canPaginate(dir: Direction) {
    if (!options.canPaginate) {
      return {
        backward: true,
        forward: true,
      }
    }

    if (typeof options.canPaginate === 'function') {
      const res = options.canPaginate(makeFnParams({ dir }))

      return typeof res === 'boolean'
        ? {
            backward: res,
            forward: res,
          }
        : res
    }

    if (typeof options.canPaginate === 'object' && 'forward' in options.canPaginate)
      return toValue(options.canPaginate)

    const res = toValue(options.canPaginate)
    return {
      backward: res,
      forward: res,
    }
  }

  function makeFnParams(params: Partial<FnParams<T>> & { dir: Direction }): FnParams<T> {
    const endItem = params.endItem ?? getItemByIdentifier(pageEndItemId.value)!
    const startItem = params.startItem ?? getItemByIdentifier(pageStartItemId.value)!

    return {
      dir: params.dir,
      endItem,
      isOnLatestPage: isOnLatestPage.value,
      listPaginated: listPaginated.value,
      startItem,
    }
  }

  return {
    getItemByIdentifier,
    isPaginating,
    isReady,
    itemBind,
    listPaginated,
    loadOlder,
    pageEndItemId,
    pageStartItemId,
  }
}
