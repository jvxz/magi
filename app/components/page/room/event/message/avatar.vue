<script lang="ts" setup>
import type { Room, User } from 'matrix-js-sdk'
import type { MatrixAvatarProps } from '~/components/matrix/avatar.vue'
import { MatrixAvatar } from '#components'

defineProps<MatrixAvatarProps & { ghost?: boolean, room?: Room, user?: User }>()
</script>

<template>
  <div :class="cn('shrink-0 size-10 group-data-[grouped=true]:h-0 mt-0.5 data-[grouped=true]:m-0', $attrs.class)">
    <template v-if="!ghost">
      <MatrixAvatar
        v-if="user"
        :user
        :room
        :size="size ?? 32"
        class="size-full cursor-pointer squish"
      />

      <USkeleton v-else class="rounded-full size-full" />
    </template>
    <USkeleton v-else class="rounded-full size-full" />
  </div>
</template>
