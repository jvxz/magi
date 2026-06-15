<script lang="ts" setup generic="T">
import type { PrimitiveProps } from 'reka-ui'

import { Primitive } from 'reka-ui'

const props = withDefaults(defineProps<PrimitiveProps & { value: T; disabled?: boolean }>(), {
  as: 'div',
})

const { openAt } = useContextMenuRegion<T>()

// https://github.com/unovue/reka-ui/blob/063db406d5c437ab271161632072559597d242e6/packages/core/src/ContextMenu/utils.ts#L1-L3
const isTouchOrPen = (e: PointerEvent) => e.pointerType !== 'mouse'
let longPress = 0

function onContextMenu(e: MouseEvent) {
  if (!props.disabled) openAt(e, props.value)
}
function onPointerDown(e: PointerEvent) {
  if (props.disabled || !isTouchOrPen(e)) return
  longPress = window.setTimeout(openAt, 700, e, props.value)
}
const clearLongPress = () => window.clearTimeout(longPress)
</script>

<template>
  <Primitive
    :as
    :as-child
    :data-disabled="disabled ? '' : undefined"
    :style="{ webkitTouchCallout: 'none' }"
    @contextmenu="onContextMenu"
    @pointerdown="onPointerDown"
    @pointermove="clearLongPress"
    @pointerup="clearLongPress"
    @pointercancel="clearLongPress"
    data-slot="context-menu-trigger"
  >
    <slot />
  </Primitive>
</template>
