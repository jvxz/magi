<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

export type UReactionItemProps = PrimitiveProps & {
  reaction: string
  count: number
  class?: HTMLAttributes['class']
}
const props = defineProps<UReactionItemProps>()

const delegated = reactiveOmit(props, 'class')
const count = toRef(props, 'count')
const prevCount = refDefault(usePrevious(count), 0)

const isEmoji = computed(() => REGEX__EMOJI_STRICT.test(props.reaction))
const imageUrl = useResolveImageUrl(() => (!isEmoji.value ? props.reaction : undefined), { size: 'small' })
</script>

<template>
  <Primitive
    data-slot="reaction-item"
    v-bind="delegated"
    :class="
      cn(
        'text-sm text-foreground p-1 px-2 border-px rounded flex gap-2 min-w-12 select-none items-center overflow-clip aria-[pressed=false]:(border-transparent bg-secondary) aria-[pressed=true]:(border-primary bg-primary/50 hover:bg-primary/50) aria-[selected=false]:(border-transparent bg-secondary) aria-[selected=true]:(border-primary bg-primary/50 hover:bg-primary/50)',
        props.class,
      )
    "
  >
    <Twemojify v-if="isEmoji" class="max-h-1em truncate" :text="reaction" />
    <Img v-else :alt="reaction" :src="imageUrl" class="max-h-1em" />

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
