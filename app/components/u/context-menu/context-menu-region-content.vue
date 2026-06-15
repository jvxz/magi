<script lang="ts" setup generic="TName extends ContextMenuName">
import type { DropdownMenuContentEmits, DropdownMenuContentProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = withDefaults(defineProps<DropdownMenuContentProps & { name: TName }>(), {
  align: 'start',
})
const emits = defineEmits<DropdownMenuContentEmits>()

const { reference, payload, close } = useContextMenuRegion(props.name)

const delegated = reactiveOmit(props, ['name', 'reference'])
const forwarded = useForwardPropsEmits(delegated, emits)
</script>

<template>
  <UDropdownMenuContent
    v-bind="forwarded"
    :reference="reference ?? undefined"
    @close-auto-focus.prevent
    data-slot="context-menu-region-content"
  >
    <slot :payload :close />
  </UDropdownMenuContent>
</template>
