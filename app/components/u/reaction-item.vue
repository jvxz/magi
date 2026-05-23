<script lang="ts">
export type UReactionItemProps = PrimitiveProps & {
  reaction: string
  count: number
}
</script>

<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = defineProps<UReactionItemProps>()

const count = toRef(props, 'count')
const prevCount = refDefault(usePrevious(count), 0)
</script>

<template>
  <Primitive
    data-slot="reaction-item"
    v-bind="$props"
    :class="
      cn(
        'text-sm text-foreground p-1 px-2 border-px rounded flex gap-2 min-w-12 select-none items-center overflow-clip aria-[pressed=false]:(border-transparent bg-card-lightest) aria-[pressed=true]:(border-primary bg-primary/50 hover:bg-primary/50) aria-[selected=false]:(border-transparent bg-card-lightest) aria-[selected=true]:(border-primary bg-primary/50 hover:bg-primary/50)',
        $attrs.class,
      )
    "
  >
    <Twemojify class="truncate" :text="reaction" />

    <div class="h-1lh relative">
      <span class="font-semibold opacity-0 select-none tabular-nums" aria-hidden="true">{{ count }}</span>

      <Transition :name="prevCount > count ? 'flip-up' : 'flip-down'">
        <span :key="count" class="font-semibold flex items-center inset-0 justify-center absolute tabular-nums">
          {{ count }}
        </span>
      </Transition>
    </div>
  </Primitive>
</template>
