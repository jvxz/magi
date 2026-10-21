<script lang="ts">
export const INJECTION_KEY__DROPDOWN_MENU_MODAL: InjectionKey<Readonly<Ref<boolean>>> = Symbol(
  'DropdownMenuModalInjectionKey',
)
</script>

<script setup lang="ts">
import type { DropdownMenuRootEmits, DropdownMenuRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

export type UDropdownMenuRootProps = DropdownMenuRootProps
export type UDropdownMenuRootEmits = DropdownMenuRootEmits

const props = withDefaults(defineProps<UDropdownMenuRootProps>(), { modal: true })
const emits = defineEmits<UDropdownMenuRootEmits>()

const delegated = reactiveOmit(props, 'modal')
const forwarded = useForwardPropsEmits(delegated, emits)

provide(INJECTION_KEY__DROPDOWN_MENU_MODAL, toRef(props, 'modal'))
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded" :modal="false">
    <slot />
  </DropdownMenuRoot>
</template>
