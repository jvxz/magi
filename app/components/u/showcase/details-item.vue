<script lang="ts" setup>
import type { ButtonProps } from '../button.vue'

export interface UShowcaseDetailsItemProps extends ButtonProps {
  type?: 'button' | 'text'
}

const props = withDefaults(defineProps<UShowcaseDetailsItemProps>(), {
  type: 'text',
  variant: 'link',
})
const delegated = reactiveOmit(props, ['class', 'as', 'onClick'])
const as = computed(() => (props.as ? props.as : props.type === 'button' ? 'button' : 'span'))
</script>

<template>
  <UButton
    v-bind="delegated"
    :as
    :class="cn('font-normal gap-0', props.type === 'text' && 'hover:no-underline cursor-text select-text', props.class)"
    data-slot="showcase-details-item"
    @click="onClick"
  >
    <slot />
  </UButton>
</template>
