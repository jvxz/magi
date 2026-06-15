<script lang="ts" setup generic="T">
// type inference for `payload` in #menu slot
defineProps<{ items?: T[] }>()

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

function close() {
  open.value = false
}

provide(CONTEXT_MENU_REGION_KEY, { close, open, openAt, payload, reference } as ContextMenuRegionApi)
</script>

<template>
  <DropdownMenuRoot v-model:open="open">
    <slot />

    <UDropdownMenuContent :reference="reference ?? undefined" @close-auto-focus.prevent>
      <slot name="menu" :payload :close />
    </UDropdownMenuContent>
  </DropdownMenuRoot>
</template>
