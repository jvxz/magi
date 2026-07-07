<script lang="ts" setup>
import type { RouteLocationRaw } from 'vue-router'

import type { NuxtLinkProps } from '#app'

import { resolveAsideListTabValue } from './root.vue'

const props = defineProps<NuxtLinkProps>()

const router = useRouter()
const value = computed(() => resolveAsideListTabValue(props.to as RouteLocationRaw, router))
</script>

<template>
  <UToggleGroupItem :value as-child>
    <UAsideListButton as-child>
      <NuxtLink v-bind="$props">
        <slot />
      </NuxtLink>
    </UAsideListButton>
  </UToggleGroupItem>
</template>
