<script setup lang="ts" generic="TName extends TooltipName">
import type { PopoverRootEmits, PopoverRootProps, TooltipRootProps } from 'reka-ui'

import { injectTooltipProviderContext, useForwardPropsEmits } from 'reka-ui'

export type UTooltipRegionRootProps<TName extends TooltipName> = PopoverRootProps &
  Pick<TooltipRootProps, 'disableClosingTrigger'> & {
    name: TName
    disabled?: boolean
    skipDelayDuration?: number
  }

const props = withDefaults(defineProps<UTooltipRegionRootProps<TName>>(), {
  disableClosingTrigger: false,
  disabled: false,
  skipDelayDuration: 300,
})
const emits = defineEmits<PopoverRootEmits>()
type T = TooltipRegions[TName]

const providerContext = injectTooltipProviderContext()

const open = defineModel<boolean>('open')

const reference = shallowRef<VirtualElement>()
const payload = shallowRef<T>()

const contentId = useId()
const wasDelayed = shallowRef(false)
const { start: startOpen, stop: stopOpen } = useTimeoutFn(
  () => {
    wasDelayed.value = true
    open.value = true
  },
  providerContext.delayDuration,
  { immediate: false },
)

watch(open, v => (v ? providerContext.onOpen() : providerContext.onClose()))

const currentTarget = shallowRef<MaybeElement>()
watch(currentTarget, (el, prev) => {
  if (prev) setTooltipOpenAttr(prev, 'remove')
  if (el) setTooltipOpenAttr(el, 'add')
})
function openAt(el: HTMLElement, next: T) {
  if (currentTarget.value && currentTarget.value !== el) setTooltipOpenAttr(currentTarget.value, 'remove')
  setTooltipOpenAttr(el, 'add')
  currentTarget.value = el

  reference.value = createFrozenReference(el)
  payload.value = next

  if (providerContext.isOpenDelayed.value) startOpen()
  else {
    stopOpen()
    wasDelayed.value = false
    open.value = true
  }
}

function close() {
  stopOpen()
  if (currentTarget.value) setTooltipOpenAttr(currentTarget.value, 'remove')

  open.value = false
  currentTarget.value = undefined
}

const propsRefs = toRefs(reactivePick(props, ['disableClosingTrigger', 'disabled']))

provide(getTooltipKey(props.name), {
  ...propsRefs,
  close,
  contentId,
  currentTarget,
  open,
  openAt,
  payload,
  reference,
} as TooltipRegionApi)

const delegated = reactiveOmit(props, ['name', 'skipDelayDuration', 'open', 'defaultOpen', 'disableClosingTrigger', 'disabled'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <PopoverRoot v-bind="forwarded" v-model:open="open" data-slot="tooltip-region-root">
    <VisuallyHidden>
      <PopoverAnchor />
    </VisuallyHidden>

    <slot />
  </PopoverRoot>
</template>
