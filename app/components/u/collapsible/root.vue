<script lang="ts" setup>
import type { CollapsibleRootEmits, CollapsibleRootProps } from 'reka-ui'

import { useForwardPropsEmits } from 'reka-ui'

const props = defineProps<CollapsibleRootProps>()
const emits = defineEmits<CollapsibleRootEmits>()

const forwardedProps = useForwardPropsEmits(props, emits)
</script>

<template>
  <CollapsibleRoot v-bind="forwardedProps" :class="cn('flex flex-col gap-2', $attrs.class)">
    <slot />
  </CollapsibleRoot>
</template>
