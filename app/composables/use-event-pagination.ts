import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { Direction } from 'matrix-js-sdk'

type MaybeElementRef = MaybeRefOrGetter<MaybeElement>

interface ItemNodeData {
  id: string
  index: string
}

interface Opts {
  room: Ref<Room>
  scrollEl: MaybeElementRef
  itemsEl: MaybeElementRef
  maxPageHeight?: MaybeRefOrGetter<number>
}

type CachedItemNode = Pick<ElementOrDimensions, 'clientHeight' | 'dataset'> & {
  dataset: {
    itemId: string
    index: string
  }
}

const itemNodeHeightCache = new Map<string, CachedItemNode>()

export function useEventPagination(opts: Opts) {
  const { events, getEventVersion, isFullyLoaded, scrollEventsAsync } = useRoomEvents(opts.room)
  const eventsPaginated = shallowRef<MatrixEvent[]>(events.value.slice(-80))
  const scrollEl = toRef(opts.scrollEl)
  const itemsEl = toRef(opts.itemsEl)
  const maxPageHeight = refDefault(toRef(opts.maxPageHeight), 3000)

  const canScroll = computed(() => canElementScroll(scrollEl.value))
  const canPaginateBackward = computed(() => !isFullyLoaded.value)
  const canPaginateForward = computed(() => eventsPaginated.value.at(-1) !== events.value.at(-1))

  const isPaginating = shallowRef(false)

  const backwardSentinelId = shallowRef<string>()
  const forwardSentinelId = shallowRef<string>()

  useIntersectionObserver([
    useQuerySelector(() => createItemQuerySelector('id', backwardSentinelId.value)),
    useQuerySelector(() => createItemQuerySelector('id', forwardSentinelId.value)),
  ], async (entries) => {
    for (const entry of entries) {
      const el = entry.target
      if (!(el instanceof HTMLElement))
        return

      const { id } = getItemNodeData(el)

      if (entry.isIntersecting && id === backwardSentinelId.value)
        await paginate(Direction.Backward)

      if (entry.isIntersecting && id === forwardSentinelId.value)
        await paginate(Direction.Forward)
    }
  })

  function createItemBind(event: MatrixEvent, index: number) {
    return {
      'data-index': index,
      'data-item-id': event.getId(),
    }
  }

  const mutex = new Mutex()
  async function paginate(dir: Direction) {
    if (mutex.isLocked && !isPaginating.value)
      return

    isPaginating.value = true

    await mutex.acquire()

    try {
      if (dir === Direction.Backward && !canPaginateBackward.value)
        return
      if (dir === Direction.Forward && !canPaginateForward.value)
        return

      const container = unrefElement(scrollEl)
      if (!container)
        return

      const sentinels = await getNextPageSentinels(dir)
      assert(sentinels, `failed to get sentinels when paginating ${dir}`)

      backwardSentinelId.value = sentinels.backward?.getId()
      forwardSentinelId.value = sentinels.forward?.getId()

      await setRange({ dir })
      if (container.scrollTop === 0)
        console.error('detected container with a `scrollTop` of 0')

      await nextTick()
    }
    finally {
      mutex.release()
      isPaginating.value = false
    }
  }

  async function handleOnMounted() {
    const anchor = getAnchor(Direction.Backward, maxPageHeight.value * 0.75)
    if (!anchor)
      return

    const { id } = getItemNodeData(anchor.element)
    backwardSentinelId.value = id

    const index = getItemRealIndex(id)
    await setRange({
      dir: Direction.Backward,
      start: index,
    })
  }

  async function getNextPageSentinels(dir: Direction) {
    const visibleAnchor = getAnchor(dir)
    if (!visibleAnchor)
      return

    const { id } = getItemNodeData(visibleAnchor.element)
    const index = getItemRealIndex(id)
    if (index === undefined)
      return

    const { end, start } = getPaddedRange(dir, index)

    await scrollEvents(dir)

    const { allCached, cached } = resolveCachedItems(events.value.slice(start, end).map(e => e.getId()!))

    let nodes: (HTMLElement | CachedItemNode)[] = []
    // mount elements to read height
    if (!allCached) {
      const probeIndices = getSentinelIndices()
      if (probeIndices.backward === undefined)
        return

      const probeStart = dir === Direction.Backward ? Math.max(0, index - 80) : probeIndices.backward
      const probeEnd = dir === Direction.Backward ? probeIndices.forward : Math.min(events.value.length - 1, index + 80)

      await setRange({
        dir,
        end: probeEnd,
        start: probeStart,
      })

      await nextTick()

      const itemsContainer = unrefElement(itemsEl)
      if (!itemsContainer)
        return

      const sliceIndices = getSentinelIndices(false)

      const arr = Array.from(itemsContainer.children) as HTMLElement[]

      nodes = dir === Direction.Backward
        ? arr.slice(Math.max(0, sliceIndices.backward! - 80), sliceIndices.backward!)
        : arr.slice(sliceIndices.forward! + 80, Math.min(arr.length, sliceIndices.forward! + 160))
    }
    else
      nodes = cached

    const { scannedNodes } = getTotalNodeHeights(
      dir === Direction.Backward ? nodes : nodes.reverse(),
      visibleAnchor.element.clientHeight,
      curr => curr <= maxPageHeight.value,
      (el) => {
        // if cached, don't re-cache
        if (!(el instanceof HTMLElement) || !el.dataset.itemId || !el.dataset.index)
          return

        const { id, index } = getItemNodeData(el)

        itemNodeHeightCache.set(id, {
          clientHeight: el.clientHeight,
          dataset: {
            index,
            itemId: id,
          },
        })
      },
    )

    const dirAnchor = scannedNodes[0]
    if (!dirAnchor) {
      if (dir !== Direction.Forward)
        return

      const lastEvent = events.value.at(-1)
      if (!lastEvent)
        return

      const oppositeAnchor = getAnchor(Direction.Backward, maxPageHeight.value * 0.5)
      if (!oppositeAnchor)
        return

      const oppositeAnchorIdx = getItemRealIndex(getItemNodeData(oppositeAnchor.element).id)
      if (oppositeAnchorIdx === undefined)
        return

      return {
        backward: events.value[oppositeAnchorIdx],
        forward: lastEvent,
      }
    }

    const { id: dirAnchorId } = getItemNodeData(dirAnchor)
    const dirAnchorIdx = getItemRealIndex(dirAnchorId)
    if (dirAnchorIdx === undefined)
      return

    const oppositeAnchor = getAnchor(dir === Direction.Backward ? Direction.Forward : Direction.Backward, maxPageHeight.value * 0.5)
    if (!oppositeAnchor)
      return

    const { id: oppositeAnchorId } = getItemNodeData(oppositeAnchor.element)
    const oppositeAnchorIdx = getItemRealIndex(oppositeAnchorId)
    if (oppositeAnchorIdx === undefined)
      return

    if (dir === Direction.Forward) {
      return {
        backward: events.value[oppositeAnchorIdx],
        forward: events.value[dirAnchorIdx],
      }
    }

    return {
      backward: events.value[dirAnchorIdx],
      forward: events.value[oppositeAnchorIdx],
    }
  }

  async function setRange(params?: {
    start?: number
    end?: number
    dir?: Direction
  }) {
    const container = unrefElement(scrollEl)
    if (!container)
      return

    if (container.scrollTop === 0 && params?.dir) {
      const anchor = getAnchor(params.dir)
      assert(anchor, 'did not get `anchor` in `setRange`')

      set()

      await retainScrollTop(container, anchor.element)
    }
    else
      set()

    function set() {
      const indices = getSentinelIndices()

      const startIdx = indices.backward !== undefined
        ? Math.max(0, params?.start ?? indices.backward)
        : undefined
      const endIdx = indices.forward !== undefined
        ? Math.min(events.value.length - 1, params?.end ?? indices.forward) + 1
        : undefined

      if (startIdx !== undefined && endIdx !== undefined && startIdx > endIdx)
        return

      const paginated = events.value.slice(startIdx, endIdx)

      eventsPaginated.value = paginated
      triggerRef(eventsPaginated)
    }
  }

  async function scrollEvents(dir: Direction) {
    const eventData = getEventById(events.value, backwardSentinelId.value)

    if (dir === Direction.Backward && (!eventData || !events.value[eventData.index - 1]))
      await scrollEventsAsync(dir)
  }

  function getPaddedRange(dir: Direction, anchorIndex: number) {
    const start = Math.max(0, dir === Direction.Backward ? anchorIndex - 80 : anchorIndex)
    const end = Math.min(events.value.length, dir === Direction.Backward ? anchorIndex + 1 : anchorIndex + 80 + 1)

    return { end, start }
  }

  function getAnchor(dir: Direction, padHeight?: number) {
    const el = unrefElement(itemsEl)
    if (!el)
      return

    const intersecting = getIntersectingNodes(el, padHeight, { containerScrollTop: scrollEl.value?.scrollTop })
    if (!intersecting)
      return

    const anchor = dir === Direction.Backward
      ? intersecting[0]
      : intersecting?.at(-1)

    if (!anchor)
      return

    return {
      ...getItemNodeData(anchor),
      element: anchor,
    }
  }

  function getSentinelIndices(real = true) {
    let forwardIdx: number | undefined
    let backwardIdx: number | undefined

    const list = real ? events.value : eventsPaginated.value

    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (!item)
        continue

      if (item.getId() === backwardSentinelId.value)
        backwardIdx = i

      if (item.getId() === forwardSentinelId.value)
        forwardIdx = i

      if (backwardIdx !== undefined && forwardIdx !== undefined) {
        return {
          backward: backwardIdx,
          forward: forwardIdx,
        }
      }
    }

    return {
      backward: backwardIdx,
      forward: forwardIdx,
    }
  }

  function getItemRealIndex(itemId: string) {
    for (let i = 0; i < events.value.length; i++) {
      const event = events.value[i]
      if (!event)
        continue

      if (event.getId() === itemId)
        return i
    }
  }

  return {
    backwardSentinelId,
    canScroll,
    createItemBind,
    events,
    eventsPaginated,
    forwardSentinelId,
    getEventVersion,
    handleOnMounted,
    scrollToBottom: () => scrollToBottom(unrefElement(scrollEl)),
  }
}

function getItemNodeData(node: HTMLElement | CachedItemNode): ItemNodeData {
  const id = node.dataset.itemId
  const index = node.dataset.index

  assert(id, 'node did not have `data-item-id` attribute')
  assert(index, 'node did not have `data-index` attribute')

  return {
    id,
    index,
  }
}

function getEventById(events: MatrixEvent[], id: string | undefined) {
  for (let i = 0; i < events.length; i++) {
    const event = events[i]
    if (!event)
      return

    if (event.getId() === id) {
      return {
        event,
        index: i,
      }
    }
  }
}

function resolveCachedItems(itemIds: string[]) {
  let allCached = true
  const cached: CachedItemNode[] = []
  const uncached: string[] = []
  for (let i = 0; i < itemIds.length; i++) {
    const id = itemIds[i]
    assert(id, 'id was undefined when resolving cached items')

    const cachedNode = itemNodeHeightCache.get(id)
    if (cachedNode) {
      cached.push(cachedNode)
      continue
    }

    allCached = false
    uncached.push(id)
  }

  return {
    allCached,
    cached,
    uncached,
  }
}

async function retainScrollTop(scrollEl: HTMLElement, anchor: HTMLElement) {
  const beforeOffsetTop = anchor.offsetTop
  await nextTick()
  const afterOffsetTop = anchor.offsetTop

  const diff = afterOffsetTop - beforeOffsetTop

  scrollEl.scrollTop += diff
}

function createItemQuerySelector(type: 'id' | 'index', input: string | undefined) {
  if (!input)
    return ''

  if (type === 'id')
    return `[data-item-id="${CSS.escape(input)}"]`

  return `[data-index="${CSS.escape(input)}"]`
}
