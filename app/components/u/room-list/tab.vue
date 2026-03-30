<script lang="ts" setup>
import type { NuxtLinkProps } from '#app'
import type { RouteLocationRaw } from 'vue-router'
import { resolveRoomListTabValue } from './index.vue'

const props = defineProps<NuxtLinkProps>()

const router = useRouter()
const value = computed(() => resolveRoomListTabValue(props.to as RouteLocationRaw, router))
</script>

<template>
  <UToggleGroupItem :value as-child>
    <URoomListButton as-child>
      <NuxtLink v-bind="$props">
        <slot />
      </NuxtLink>
    </URoomListButton>
  </UToggleGroupItem>
</template>
