<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

defineProps<PrimitiveProps & {
  isEncrypted?: boolean
  content: string | undefined
}>()
</script>

<template>
  <p v-if="!isEncrypted" class="">
    {{ content }}
  </p>
  <p v-else class="">
    Encrypted message
  </p>
</template>
