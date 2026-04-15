import type { MatrixEvent, Room } from 'matrix-js-sdk'
import { Direction } from 'matrix-js-sdk'
import QuickLRU from 'quick-lru'

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

interface CachedScrollState {
  backwardSentinelId: string | undefined
  forwardSentinelId: string | undefined
  scrollTop: number
}

const itemNodeHeightCache = new QuickLRU<string, CachedItemNode>({ maxSize: 2048 })
const pageScrollStateCache = new QuickLRU<string, CachedScrollState>({ maxSize: 32 })

export function useEventPagination(opts: Opts) {
  const { events, getEventVersion, isFullyLoaded, scrollEventsAsync } = useRoomEvents(opts.room)
  const eventsPaginated = shallowRef<MatrixEvent[]>(events.value.slice(-80))
  const scrollEl = toRef(opts.scrollEl)
  const itemsEl = toRef(opts.itemsEl)
  const maxPageHeight = refDefault(toRef(opts.maxPageHeight), 5000)

  const canScroll = computed(() => canElementScroll(scrollEl.value))
  const canPaginateBackward = computed(() => !isFullyLoaded.value || eventsPaginated.value[0] !== events.value[0])
  const canPaginateForward = computed(() => eventsPaginated.value.at(-1) !== events.value.at(-1))

  const isPaginating = shallowRef(false)
  const isPinned = shallowRef(false)

  const backwardSentinelId = shallowRef<string>()
  const forwardSentinelId = shallowRef<string>()
  const { element: backwardSentinelEl } = useQuerySelector(() => createItemQuerySelector('id', backwardSentinelId.value), { observeScope: true, scope: itemsEl })
  const { element: forwardSentinelEl } = useQuerySelector(() => createItemQuerySelector('id', forwardSentinelId.value), { observeScope: true, scope: itemsEl })

  const { resume: startIntersectionObserver } = useIntersectionObserver([backwardSentinelEl, forwardSentinelEl,
  ], async (entries) => {
    for (const entry of entries) {
      const el = entry.target
      if (!(el instanceof HTMLElement))
        continue

      const { id } = getItemNodeData(el)

      if (entry.isIntersecting && id === backwardSentinelId.value)
        await paginate(Direction.Backward)

      if (entry.isIntersecting && id === forwardSentinelId.value)
        await paginate(Direction.Forward)
    }
  }, { immediate: false })

  watch(events, async (newEvents, prevEvents) => {
    if (isPaginating.value)
      return

    const container = unrefElement(scrollEl)
    if (!container)
      return

    const prevEventsLastId = prevEvents.at(-1)?.getId()
    const prevForwardSentinelId = forwardSentinelId.value
    const paginatedLastId = eventsPaginated.value.at(-1)?.getId()
    const isAtForwardEnd = paginatedLastId === prevEventsLastId

    if (isAtForwardEnd) {
      if (prevEventsLastId && prevEventsLastId === prevForwardSentinelId) {
        const newLastEvent = newEvents.at(-1)

        if (newLastEvent && newLastEvent.getId() !== forwardSentinelId.value) {
          const sentinels = await getNextPageSentinels(Direction.Forward)

          if (sentinels) {
            backwardSentinelId.value = sentinels.backward?.getId()
            forwardSentinelId.value = sentinels.forward?.getId()
          }
        }
      }
    }

    if (isPinned.value) {
      await nextTick()
      scrollToBottom(container)
    }
  }, { flush: 'post' })

  // for isPinned
  useEventListener(scrollEl, 'scroll', ({ target }) => {
    const el = target as HTMLElement
    if (!el)
      return

    isPinned.value = !canPaginateForward.value && isPinnedToBottom(el)
  })

  onBeforeRouteUpdate(() => {
    const container = unrefElement(scrollEl)
    if (!container)
      return

    const roomId = opts.room.value.roomId

    pageScrollStateCache.set(roomId, {
      backwardSentinelId: backwardSentinelId.value,
      forwardSentinelId: forwardSentinelId.value,
      scrollTop: container.scrollTop,
    })
  })

  function createItemBind(event: MatrixEvent, index: number) {
    return {
      'data-index': index,
      'data-item-id': event.getId(),
    }
  }

  async function paginate(dir: Direction) {
    if (isPaginating.value)
      return

    isPaginating.value = true

    try {
      if (dir === Direction.Backward && !canPaginateBackward.value)
        return
      if (dir === Direction.Forward && !canPaginateForward.value)
        return

      const container = unrefElement(scrollEl)
      if (!container)
        return

      const sentinels = await getNextPageSentinels(dir)
      if (!sentinels)
        return

      backwardSentinelId.value = sentinels.backward?.getId()
      forwardSentinelId.value = sentinels.forward?.getId()

      await setRange({ dir })

      await nextTick()
    }
    finally {
      isPaginating.value = false
    }
  }

  async function handleOnMounted() {
    const anchor = getAnchor(Direction.Backward, maxPageHeight.value * 0.75)
    if (!anchor)
      return

    const cachedScrollState = pageScrollStateCache.get(opts.room.value.roomId)

    let backwardId = cachedScrollState?.backwardSentinelId ?? getItemNodeData(anchor.element).id
    const forwardId = cachedScrollState?.forwardSentinelId ?? eventsPaginated.value.at(-1)?.getId()

    if (
      forwardId
      && !cachedScrollState?.backwardSentinelId
      && backwardId === forwardId
      && eventsPaginated.value.length > 1
    )
      backwardId = eventsPaginated.value[0]?.getId() ?? backwardId

    backwardSentinelId.value = backwardId
    forwardSentinelId.value = forwardId

    const index = getItemRealIndex(backwardId)
    await setRange({
      dir: Direction.Backward,
      start: index,
    })

    const container = unrefElement(scrollEl)
    if (!container)
      return

    const itemsRoot = unrefElement(itemsEl)
    const backwardProbeEl = getItemNodeData(anchor.element).id === backwardId
      ? anchor.element
      : itemsRoot?.querySelector<HTMLElement>(createItemQuerySelector('id', backwardId)) ?? anchor.element

    if (isIntersecting(container, backwardProbeEl) && !isFullyLoaded.value) {
      await scrollEventsAsync(Direction.Backward)
      backwardSentinelId.value = events.value[0]?.getId()
      setRange()

      await nextTick()

      if (!cachedScrollState)
        scrollToBottom(container)
    }

    if (cachedScrollState)
      container.scrollTop = cachedScrollState.scrollTop

    isPinned.value = isPinnedToBottom(container)

    await nextTick()
    startIntersectionObserver()
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
        : arr.slice(sliceIndices.forward! + 1, Math.min(arr.length, sliceIndices.forward! + 81))
    }
    else
      nodes = cached

    const heightNodes = dir === Direction.Backward ? nodes : [...nodes].reverse()

    const { scannedNodes, stoppedEarly } = getTotalNodeHeights(
      heightNodes,
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

    const dirAnchor = stoppedEarly ? scannedNodes.at(-1) : scannedNodes[0]

    if (!dirAnchor) {
      if (dir === Direction.Forward) {
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

      if (dir === Direction.Backward) {
        if (index <= 0)
          return

        const oppositeAnchor = getAnchor(Direction.Forward, maxPageHeight.value * 0.5)
        let oppositeAnchorIdx = oppositeAnchor
          ? getItemRealIndex(getItemNodeData(oppositeAnchor.element).id)
          : undefined

        if (oppositeAnchorIdx === undefined && forwardSentinelId.value)
          oppositeAnchorIdx = getItemRealIndex(forwardSentinelId.value)

        if (oppositeAnchorIdx === undefined) {
          const lastPaginatedId = eventsPaginated.value.at(-1)?.getId()
          if (lastPaginatedId)
            oppositeAnchorIdx = getItemRealIndex(lastPaginatedId)
        }

        if (oppositeAnchorIdx === undefined)
          oppositeAnchorIdx = index

        return {
          backward: events.value[index - 1],
          forward: events.value[oppositeAnchorIdx],
        }
      }

      return
    }

    const { id: dirAnchorId } = getItemNodeData(dirAnchor)
    const dirAnchorIdx = getItemRealIndex(dirAnchorId)
    if (dirAnchorIdx === undefined)
      return

    const oppositeAnchor = getAnchor(dir === Direction.Backward ? Direction.Forward : Direction.Backward, maxPageHeight.value * 0.5)
    let oppositeAnchorIdx = oppositeAnchor
      ? getItemRealIndex(getItemNodeData(oppositeAnchor.element).id)
      : undefined

    if (oppositeAnchorIdx === undefined && forwardSentinelId.value)
      oppositeAnchorIdx = getItemRealIndex(forwardSentinelId.value)

    if (oppositeAnchorIdx === undefined) {
      const lastPaginatedId = eventsPaginated.value.at(-1)?.getId()
      if (lastPaginatedId)
        oppositeAnchorIdx = getItemRealIndex(lastPaginatedId)
    }

    if (oppositeAnchorIdx === undefined)
      oppositeAnchorIdx = dirAnchorIdx

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
      if (indices.backward === undefined || indices.forward === undefined)
        return
      const startIdx = Math.max(0, params?.start ?? indices.backward)
      const endIdx = Math.min(events.value.length - 1, params?.end ?? indices.forward) + 1

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

    const intersecting = getIntersectingNodes(el, padHeight, {
      containerClientHeight: scrollEl.value?.clientHeight,
      containerScrollTop: scrollEl.value?.scrollTop,
    })

    if (!intersecting?.length)
      return

    let anchor: HTMLElement | undefined

    if (dir === Direction.Backward) {
      anchor = intersecting.reduce((best, child) => {
        const bi = Number.parseInt(best.dataset.index ?? '', 10)
        const ci = Number.parseInt(child.dataset.index ?? '', 10)

        if (Number.isNaN(ci))
          return best
        if (Number.isNaN(bi))
          return child

        return ci < bi ? child : best
      })

      const paginatedLast = eventsPaginated.value.at(-1)?.getId()
      const paginatedFirst = eventsPaginated.value[0]?.getId()

      if (
        paginatedLast
        && paginatedFirst
        && paginatedFirst !== paginatedLast
      ) {
        const anchorId = getItemNodeData(anchor).id
        if (anchorId === paginatedLast) {
          const preferred = el.querySelector<HTMLElement>(createItemQuerySelector('id', paginatedFirst))
          if (preferred && !preferred.hasAttribute('data-ignore'))
            anchor = preferred
        }
      }
    }
    else anchor = intersecting.at(-1)

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
    isPaginating,
    scrollToBottom: () => scrollToBottom(unrefElement(scrollEl)),
  }
}

function isPinnedToBottom(container: HTMLElement) {
  return container.scrollHeight - container.scrollTop - container.clientHeight < 50
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
      continue

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
  for (let i = 0; i < itemIds.length; i++) {
    const id = itemIds[i]
    assert(id, 'id was undefined when resolving cached items')

    const cachedNode = itemNodeHeightCache.get(id)
    if (cachedNode) {
      cached.push(cachedNode)
      continue
    }

    allCached = false
  }

  return {
    allCached,
    cached,
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
