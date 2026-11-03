<script lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { VariantProps } from 'tailwind-variants'

export interface USettingRootContext {
  id: string
}

export const [injectSettingContext, provideSettingContext] = createContext<USettingRootContext>('USettingRoot')

const settingRootVariants = tv({
  base: 'flex gap-2',
  defaultVariants: {
    orientation: 'horizontal',
  },
  variants: {
    orientation: {
      horizontal: 'items-center justify-between',
      vertical: 'flex-col items-start justify-start',
    },
  },
})
export type SettingRootVariants = VariantProps<typeof settingRootVariants>
</script>

<script lang="ts" setup>
export interface USettingRootProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  orientation?: SettingRootVariants['orientation']
}

const props = defineProps<USettingRootProps>()

const delegated = reactiveOmit(props, ['class', 'orientation'])

const id = useId()
provideSettingContext({ id })
</script>

<template>
  <Primitive
    v-bind="delegated"
    :class="cn(settingRootVariants({ orientation }), props.class)"
    :data-orientation="orientation"
    data-slot="setting-root"
  >
    <slot :id />
  </Primitive>
</template>
