<script lang="ts" setup>
import type { MatrixAvatarProps } from '~/components/matrix/avatar.vue'
import { MatrixAvatar } from '#components'

defineProps<MatrixAvatarProps>()
</script>

<template>
  <Slot
    :class="cn('mt-1 shrink-0 size-10', $attrs.class)"
    as-child
  >
    <MatrixAvatar
      v-if="user"
      :user
      :size="size ?? 32"
    />
    <USkeleton class="rounded-full" v-else />
  </Slot>
</template>
