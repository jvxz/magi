<script lang="ts" setup generic="T">
const props = defineProps<{
  items: T[]
  estimateSize: (item: T, index: number) => number
  getItemKey: (item: T) => string | number
  gap?: number
  scrollEl: HTMLElement | null
  rowClass?: HTMLAttributes['class']
}>()

defineSlots<{ default: (props: { item: T; index: number }) => any }>()

const listEl = useTemplateRef<HTMLDivElement>('list')

const scrollMargin = ref(0)
useResizeObserver(
  () => [listEl.value, props.scrollEl?.firstElementChild as HTMLElement | undefined],
  () => {
    const list = listEl.value
    const scroller = props.scrollEl
    if (!list || !scroller) return

    scrollMargin.value = list.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop
  },
)

const virtualizer = useListVirtualizer(
  () => props.items,
  () => props.scrollEl,
  {
    estimateSize: (item, i) => props.estimateSize(item, i),
    gap: props.gap,
    getItemKey: item => props.getItemKey(item),
    scrollMargin,
  },
)

defineExpose({ virtualizer })
</script>

<template>
  <div ref="list" class="w-full relative" :style="{ height: `${virtualizer.getTotalSize()}px` }">
    <div
      v-for="row in virtualizer.getVirtualItems()"
      :key="String(row.key)"
      :data-index="row.index"
      :class="cn('w-full left-0 top-0 absolute', rowClass)"
      :style="{ transform: `translateY(${row.start - scrollMargin}px)` }"
    >
      <slot :item="items[row.index]!" :index="row.index" />
    </div>
  </div>
</template>
