<script lang="ts" setup>
import type { MatrixAvatarProps } from '~/components/matrix/avatar.vue'

const props = withDefaults(defineProps<MatrixAvatarProps & { class?: string }>(), { square: true })

const delegated = reactiveOmit(props, 'class')
</script>

<template>
  <MatrixAvatar v-bind="delegated" :class="cn('rounded shrink-0 size-10', props.class)">
    <slot />
  </MatrixAvatar>
</template>
