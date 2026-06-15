<script lang="ts" setup generic="TName extends ContextMenuName">
import type { DropdownMenuRootEmits, DropdownMenuRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<DropdownMenuRootProps & { name: TName }>()
const emits = defineEmits<DropdownMenuRootEmits>()
type T = ContextMenuRegions[TName]

const open = shallowRef(false)
const reference = shallowRef<VirtualElement>(createPointReference({ clientX: 0, clientY: 0 }))
const payload = shallowRef<T>()

let currentTarget: MaybeElement
whenever(
  () => !open.value,
  () => {
    setContextMenuOpenAttr(currentTarget, 'remove')
    currentTarget = undefined
    payload.value = undefined
  },
)

function openAt(event: MouseEvent | PointerEvent, next: T) {
  event.preventDefault()
  const target = event.currentTarget instanceof HTMLElement ? event.currentTarget : undefined
  if (currentTarget && currentTarget !== target) setContextMenuOpenAttr(currentTarget, 'remove')
  setContextMenuOpenAttr(target, 'add')
  currentTarget = target

  reference.value = createPointReference(event)
  payload.value = next
  open.value = true
}

const close = () => (open.value = false)

provide(getContextMenuKey(props.name), { close, open, openAt, payload, reference } as ContextMenuRegionApi)

const delegated = reactiveOmit(props, ['name', 'open', 'defaultOpen'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded" v-model:open="open">
    <slot />
  </DropdownMenuRoot>
</template>
