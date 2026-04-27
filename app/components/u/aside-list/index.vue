<script lang="ts">
import type { ToggleGroupRootEmits, ToggleGroupRootProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { RouteLocationRaw, Router } from 'vue-router'
import { useForwardPropsEmits } from 'reka-ui'

export function resolveRoomListTabValue(route: RouteLocationRaw, router: Router) {
  const { name, params } = router.resolve(route)

  if (!params)
    return name

  return Object.values(params).join('-')
}
</script>

<script lang="ts" setup>
const props = defineProps<ToggleGroupRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<ToggleGroupRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const route = useRoute()
const router = useRouter()
const value = computed(() => resolveRoomListTabValue(route as RouteLocationRaw, router))
</script>

<template>
  <ToggleGroupRoot
    v-bind="forwarded"
    :model-value="value"
    :class="cn('p-2.5 flex flex-col gap-[2px] w-full *:w-full *:justify-start', props.class)"
  >
    <slot />
  </ToggleGroupRoot>
</template>
