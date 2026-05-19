<script lang="ts" setup>
import type { CompactEmoji } from 'emojibase'
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/vue-virtual'
import { useFilter } from 'reka-ui'
import { getEmojiKey, injectEmojiPickerContext } from './root.vue'

const COLS = 9
const HEADER_SIZE = 24
const ROW_SIZE = 32

const { categories, groupedEmojis, isLoading } = useEmojiData()
const { activeEmoji, isInputFocused, onInputMove, onPick, scopeId, searchQuery } = injectEmojiPickerContext()

const scrollEl = useTemplateRef('scrollEl')

interface FlatItemHeader {
  type: 'header'
  label: string
  key: string
}

interface FlatItemCells {
  emojis: CompactEmoji[]
  key: string
  type: 'cells'
}
type FlatItem = FlatItemHeader | FlatItemCells

const flatList = computed(() => {
  const flat: FlatItem[] = []
  for (const [key, category] of objectEntries(categories.value)) {
    const emojis = getFilteredEmojis(groupedEmojis.value[key] ?? [])
    if (!emojis.length) continue

    flat.push({ key: category.key, label: category.label, type: 'header' })

    for (let i = 0; i < emojis.length; i += COLS) {
      const emoji = emojis[i]
      if (!emoji) continue

      flat.push({ emojis: emojis.slice(i, i + COLS), key: makeKey([i, key]), type: 'cells' })
    }
  }

  return flat
})

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
  const emojis: CompactEmoji[] = []
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

const emojiFlatIdxMap = computed(() => new Map(flatEmojis.value.map((e, i) => [e.hexcode, i])))

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
function getFilteredEmojis(emojis: CompactEmoji[]): CompactEmoji[] {
  if (!searchQuery.value) return emojis

  const filtered: CompactEmoji[] = []
  for (const emoji of emojis) {
    if (contains([emoji.label, ...(emoji.tags ?? [])].join(' '), searchQuery.value)) filtered.push(emoji)
  }
  return filtered
}

function getEmojiFlatIdx(targetEmoji: CompactEmoji) {
  return emojiFlatIdxMap.value.get(targetEmoji.hexcode) ?? -1
}

function clampIdx(idx: number) {
  return clamp(idx, 0, flatEmojis.value.length - 1)
}

function handleSelect(manualEmoji?: CompactEmoji) {
  const emoji = manualEmoji ?? activeEmoji.value
  if (emoji) onPick?.(emoji)
}
</script>

<template>
  <div
    class="pl-[calc(var(--emoji-picker-padding)*0.5)] rounded shrink size-full relative overflow-hidden"
    :style="{
      '--active-color': `color-mix(in srgb, var(--muted) ${isInputFocused ? '60%' : '100%'}, transparent)`,
    }"
  >
    <div ref="scrollEl" class="overscroll-none size-full overflow-y-auto scrollbar-gutter-stable">
      <div v-if="!isLoading" class="w-full relative" :style="{ height: `${totalSize}px` }">
        <div
          v-for="v in virtualItems"
          :key="flatList[v.index]!.key"
          :ref="el => el && virtualizer.measureElement(el as HTMLElement)"
          :data-index="v.index"
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
            class="bg-card-light flex h-6 items-center"
            :style="{ zIndex: v.index }"
          >
            <p class="text-xs text-muted-foreground font-medium ps-1.5">
              {{ upperFirst((flatList[v.index] as FlatItemHeader).label) }}
            </p>
          </div>

          <div v-else class="grid grid-cols-9">
            <button
              v-for="emoji in (flatList[v.index] as FlatItemCells).emojis"
              :id="getEmojiKey(scopeId, emoji)"
              :key="emoji.hexcode"
              :title="emoji.label"
              role="gridcell"
              tabindex="-1"
              type="button"
              :data-active="activeEmoji?.hexcode === emoji.hexcode ? '' : undefined"
              class="text-base rounded grid size-8 aspect-square transition-transform place-items-center active:bg-[var(--active-color)] data-[active]:bg-[var(--active-color)]"
              @click="handleSelect(emoji)"
              @mouseover="activeEmojiIdx = getEmojiFlatIdx(emoji)"
            >
              {{ emoji.unicode }}
            </button>
          </div>
        </div>
      </div>
      <template v-else>
        <div>
          <div class="ps-1 bg-card-light h-6 top-0 sticky z-2">
            <USkeleton class="text-xs text-muted-foreground font-medium h-1lh w-1/3" />
          </div>

          <div class="grid grid-cols-9">
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
