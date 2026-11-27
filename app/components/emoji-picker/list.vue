<script lang="ts" setup>
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/vue-virtual'
import { useFilter } from 'reka-ui'

import { injectEmojiPickerContext } from './root.vue'

const COLUMN_COUNT = 9
const HEADER_SIZE = 24
const ROW_SIZE = 32

const { categories, isLoading } = useEmojibase()
const { unicodeByGroup } = useEmoji()
const { getTwemojiUrl } = useTwemoji()
const { activeEmoji, gridId, isInputFocused, onInputMove, onPick, scopeId, searchQuery, ...ctx } =
  injectEmojiPickerContext()

const scrollEl = useTemplateRef('scrollEl')

interface FlatItemHeader {
  type: 'header'
  label: string
  key: string
}

interface FlatItemCells {
  emojis: Emoji[]
  key: string
  type: 'cells'
}
type FlatItem = FlatItemHeader | FlatItemCells

const { allEmojiPacks } = useUserImagePacks()

const { client } = useMatrixClient()
const reducedMotion = usePreferredReducedMotion()

const customSections = computed(() => {
  const opts: ResolveImageUrlOpts = {
    allowDirectLinks: true,
    animated: reducedMotion.value !== 'reduce',
    baseUrl: client.value.getHomeserverUrl(),
    resizeMethod: 'scale',
    size: 'small',
  }

  const srcs = new Map<string, string | undefined>()
  const sections: { emojis: Emoji[]; key: string; label: string }[] = []

  for (const pack of allEmojiPacks.value) {
    const isEnabled = pack.roomId ? toValue(ctx.userRoomPacks) : toValue(ctx.userEmojis)
    if (!isEnabled) continue

    const emojis = fromImagePack(pack)
    for (const emoji of emojis) {
      if (emoji.type === 'custom') srcs.set(emoji.key, resolveImageUrl(emoji.url, opts))
    }

    const fallbackLabel = pack.roomId ? client.value.getRoom(pack.roomId)?.name : 'Personal'
    sections.push({ emojis, key: `pack-${pack.id}`, label: pack.display_name ?? fallbackLabel ?? pack.id })
  }

  return { sections, srcs }
})

const flatList = computed(() => {
  const flat: FlatItem[] = []

  // customs first
  for (const section of customSections.value.sections) {
    pushSection(flat, section.key, section.label, section.emojis)
  }

  // then emojibase
  for (const [key, category] of objectEntries(categories.value)) {
    pushSection(flat, category.key, category.label, unicodeByGroup.value[key] ?? [])
  }

  return flat
})

function pushSection(flat: FlatItem[], key: string, label: string, sectionEmojis: Emoji[]) {
  const emojis = getFilteredEmojis(sectionEmojis)
  if (!emojis.length) return

  flat.push({ key, label, type: 'header' })

  for (let i = 0; i < emojis.length; i += COLUMN_COUNT) {
    flat.push({ emojis: emojis.slice(i, i + COLUMN_COUNT), key: makeKey([i, key]), type: 'cells' })
  }
}

const headerIndices = computed(() => flatList.value.flatMap(({ type }, i) => (type === 'header' ? [i] : [])))
const activeHeaderIdx = ref<number>()

const isSticky = (idx: number) => headerIndices.value.includes(idx)
const isActiveSticky = (idx: number) => activeHeaderIdx.value === idx

const virtualizer = useVirtualizer(
  computed(() => ({
    count: flatList.value.length,
    estimateSize: i => (flatList.value[i]?.type === 'header' ? HEADER_SIZE : ROW_SIZE),
    getItemKey: i => flatList.value[i]?.key ?? i,
    getScrollElement: () => scrollEl.value,
    overscan: 4,
    rangeExtractor: range => {
      const active = headerIndices.value.toReversed().find(i => i <= range.startIndex)
      activeHeaderIdx.value = active

      const next = new Set([...headerIndices.value, ...defaultRangeExtractor(range)])
      return [...next].toSorted((a, b) => a - b)
    },
  })),
)

const virtualItems = computed(() => virtualizer.value.getVirtualItems())
const totalSize = computed(() => virtualizer.value.getTotalSize())

const flatEmojis = computed(() => {
  const emojis: Emoji[] = []
  for (const item of flatList.value) {
    if (item.type === 'cells') {
      emojis.push(...item.emojis)
    }
  }

  return emojis
})

const activeEmojiIdx = ref(0)
watch(activeEmojiIdx, idx => {
  activeEmoji.value = flatEmojis.value[idx]
  if (!activeEmoji.value) return

  const id = getEmojiKey(scopeId, activeEmoji.value)

  nextTick(() => {
    const emojiEl = document.getElementById(id)
    emojiEl?.scrollIntoView({ block: 'nearest' })
  })
})

const emojiFlatIdxMap = computed(() => new Map(flatEmojis.value.map((e, i) => [e.key, i])))

function move(key: string) {
  const idx = activeEmojiIdx.value

  const rows: { start: number; len: number }[] = []
  let count = 0
  for (const item of flatList.value) {
    if (item.type === 'cells') {
      rows.push({ len: item.emojis.length, start: count })
      count += item.emojis.length
    }
  }

  if (!rows.length) return

  let rowIdx = 0
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if (!row) continue
    if (idx >= row.start && idx < row.start + row.len) {
      rowIdx = i
      break
    }
  }
  const col = idx - rows[rowIdx]!.start

  switch (key) {
    case 'ArrowUp':
      if (rowIdx === 0) {
        isInputFocused.value = true
        // oxlint-disable-next-line no-useless-return
        return
      }

      for (let i = rowIdx - 1; i >= 0; i--) {
        const r = rows[i]
        if (!r) continue
        if (col < r.len) {
          activeEmojiIdx.value = r.start + col
          break
        }
      }
      break
    case 'ArrowDown':
      for (let i = rowIdx + 1; i < rows.length; i++) {
        const r = rows[i]
        if (!r) continue
        if (col < r.len) {
          activeEmojiIdx.value = r.start + col
          break
        }
      }
      break
    case 'ArrowLeft':
      activeEmojiIdx.value = clampIdx(idx - 1)
      break
    case 'ArrowRight':
      activeEmojiIdx.value = clampIdx(idx + 1)
      break
  }
}

let wasInInput = false
onInputMove(({ dir }) => {
  if (dir === 'down' && isInputFocused.value) {
    isInputFocused.value = false
    wasInInput = true
  }
})

onKeyDown(
  ({ key }) => ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Enter'].includes(key),
  e => {
    const { key } = e

    if (key === 'Enter' && !isInputFocused.value) {
      if (activeEmoji.value) {
        e.preventDefault()
        onPick?.(activeEmoji.value)
      }

      return
    }

    if (isInputFocused.value) return

    e.preventDefault()

    if (wasInInput) wasInInput = false
    else move(key)
  },
)

watch(
  searchQuery,
  () => {
    activeEmojiIdx.value = 0
    activeEmoji.value = flatEmojis.value[0]
    virtualizer.value.scrollToIndex(0)
  },
  { immediate: true },
)

function makeKey(input: (string | number)[]) {
  return `r-${input.join('-')}`
}

const { contains } = useFilter({ sensitivity: 'base' })
function getFilteredEmojis(emojis: Emoji[]): Emoji[] {
  if (!searchQuery.value) return emojis

  const filtered: Emoji[] = []
  for (const emoji of emojis) {
    if (contains(emoji.terms, searchQuery.value)) filtered.push(emoji)
  }
  return filtered
}

function getEmojiFlatIdx(targetEmoji: Emoji) {
  return emojiFlatIdxMap.value.get(targetEmoji.key) ?? -1
}

function clampIdx(idx: number) {
  return clamp(idx, 0, flatEmojis.value.length - 1)
}

function handleSelect(manualEmoji?: Emoji) {
  const emoji = manualEmoji ?? activeEmoji.value
  if (emoji) onPick?.(emoji)
}

const { polite } = useAnnouncer()
watchDebounced(
  () => [searchQuery.value, flatEmojis.value.length],
  ([query, count]) => {
    if (!query) return
    polite(count === 0 ? 'No results' : `${count} ${count === 1 ? 'result' : 'results'}`)
  },
  { debounce: 300 },
)
</script>

<template>
  <div
    class="pl-[calc(var(--emoji-picker-padding)*0.5)] rounded shrink size-full relative overflow-hidden"
    :style="{
      '--active-color': `color-mix(in srgb, var(--selected) ${isInputFocused ? '80%' : '100%'}, transparent)`,
    }"
  >
    <div ref="scrollEl" class="overscroll-none size-full overflow-y-auto scrollbar-gutter-stable">
      <div
        v-if="!isLoading"
        :id="gridId"
        role="grid"
        aria-label="Emoji"
        class="w-full relative"
        :style="{ height: `${totalSize}px` }"
      >
        <div
          v-for="v in virtualItems"
          :key="flatList[v.index]!.key"
          :ref="el => el && virtualizer.measureElement(el as HTMLElement)"
          :data-index="v.index"
          role="presentation"
          :style="
            isActiveSticky(v.index)
              ? {
                  position: 'sticky',
                  top: '0px',
                  left: 0,
                  width: '100%',
                  zIndex: 1,
                }
              : {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  transform: `translateY(${v.start}px)`,
                  ...(isSticky(v.index) ? { zIndex: 0 } : {}),
                }
          "
        >
          <div
            v-if="flatList[v.index]!.type === 'header'"
            class="bg-popover flex h-6 items-center"
            :style="{ zIndex: v.index }"
          >
            <p class="text-xs text-muted-foreground font-medium ps-1.5">
              {{ upperFirst((flatList[v.index] as FlatItemHeader).label) }}
            </p>
          </div>

          <div v-else role="row" class="grid grid-cols-9">
            <button
              v-for="emoji in (flatList[v.index] as FlatItemCells).emojis"
              :id="getEmojiKey(scopeId, emoji)"
              :key="emoji.key"
              :title="emoji.label"
              role="gridcell"
              tabindex="-1"
              type="button"
              :data-active="activeEmoji?.key === emoji.key ? '' : undefined"
              class="text-base rounded grid size-8 aspect-square transition-transform place-items-center data-[active]:bg-[var(--active-color)]"
              @click="handleSelect(emoji)"
              @mouseover="activeEmojiIdx = getEmojiFlatIdx(emoji)"
            >
              <img
                v-if="emoji.type === 'unicode'"
                :src="getTwemojiUrl(emoji.unicode)"
                :alt="emoji.unicode"
                class="size-4.5"
                decoding="async"
                draggable="false"
              />
              <img
                v-else
                :src="customSections.srcs.get(emoji.key)"
                :alt="emoji.shortcode"
                class="size-4.5 object-contain"
                decoding="async"
                draggable="false"
              />
            </button>
          </div>
        </div>
      </div>
      <template v-else>
        <div :id="gridId" role="grid" aria-label="Emoji" aria-busy="true">
          <div class="ps-1 bg-popover h-6 top-0 sticky z-2">
            <USkeleton class="text-xs text-muted-foreground font-medium h-1lh w-1/3" />
          </div>

          <div role="presentation" class="grid grid-cols-9">
            <USkeleton
              v-for="i in 63"
              :key="i"
              class="m-0.5 w-auto aspect-square z-1 overflow-clip"
              style="content-visibility: auto; contain-intrinsic-size: 32px 32px"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
