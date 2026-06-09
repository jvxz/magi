<script lang="ts" setup>
import type { MatrixAvatarProps } from '~/components/matrix/avatar.vue'

import { MatrixAvatar } from '#components'

defineProps<MatrixAvatarProps & { ghost?: boolean }>()
</script>

<template>
  <div :class="cn('shrink-0 size-10 group-data-[grouped=true]:h-0 mt-0.5 data-[grouped=true]:m-0', $attrs.class)">
    <template v-if="!ghost">
      <MatrixAvatar :placeholder-key :user :size="size ?? 32" class="size-full cursor-pointer" />
    </template>
    <USkeleton v-else class="rounded-full size-full" />
  </div>
</template>
