<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

defineOptions({ inheritAttrs: false })

export interface UCardGroupItemImageProps extends PrimitiveProps {
  class?: HTMLAttributes['class']
  dialog?: GlobalDialogMap['avatar']
  prevent?: boolean
}

const props = withDefaults(defineProps<UCardGroupItemImageProps>(), { as: 'img' })

const { openDialog } = useGlobalDialog()
const box = 'size-10 rounded-sm aspect-square shrink-0'

const handleClick = (e: Event) => {
  if (props.prevent) e.preventDefault()
  if (props.dialog) openDialog('avatar', props.dialog)
}
</script>

<template>
  <button
    v-if="dialog"
    type="button"
    :class="cn(box, 'relative of-clip cursor-pointer', props.class)"
    data-slot="card-group-image"
    @click="handleClick"
  >
    <Primitive :as :as-child class="size-full object-cover" v-bind="$attrs">
      <slot />
    </Primitive>
    <div class="absolute inset-0 hover:bg-hover-overlay" />
  </button>

  <Primitive
    v-else
    :as
    :as-child
    :class="cn(box, 'object-cover', props.class)"
    data-slot="card-group-image"
    v-bind="$attrs"
  >
    <slot />
  </Primitive>
</template>
