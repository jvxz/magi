<script setup lang="ts">
const { useInjection } = defineProps<{ height: number, useInjection?: boolean }>()

const el = useTemplateRef('el')
const visible = ref(false)

const observer = useInjection
  ? injectIntersectionObserver()
  : useIntersectionObserver(el, ([entry]) => onObserve(entry), { rootMargin: '200px' })

onMounted(() => {
  const o = toValue(observer)
  if (o && 'observe' in o) {
    const e = unrefElement(el)
    if (e)
      o.observe(e, entry => onObserve(entry))
  }
})

onUnmounted(() => {
  const o = toValue(observer)
  if (o && 'observe' in o) {
    const e = unrefElement(el)
    if (e)
      o.unobserve(e)
  }
})

function onObserve(entry: IntersectionObserverEntry | undefined) {
  if (entry?.isIntersecting)
    visible.value = true
}
</script>

<template>
  <div
    ref="el"
    data-slot="lazy"
    :style="{ minHeight: visible ? undefined : `${height}px` }"
  >
    <slot v-if="visible" />
  </div>
</template>
