<script lang="ts" setup generic="TName extends ContextMenuName">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<DropdownMenuContentProps & { name: TName }>(), {
  align: 'start',
})
const emits = defineEmits<DropdownMenuContentEmits>()

const { close, payload, reference } = useContextMenuRegion(props.name)

const delegated = reactiveOmit(props, ['name', 'reference'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <UDropdownMenuContent
    v-bind="forwarded"
    :reference="reference ?? undefined"
    data-slot="context-menu-region-content"
    @close-auto-focus.prevent
  >
    <slot :payload :close />
  </UDropdownMenuContent>
</template>
