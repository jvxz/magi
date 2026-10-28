<script lang="ts" setup>
import type { ImageContent } from 'matrix-js-sdk'

import { injectEventListItemContext } from '../generic.vue'

const { event } = injectEventListItemContext()
const { content } = useEventContent<ImageContent>(event)
const blurhash = computed(() => getImageBlurhash(content.value))

const url = useResolveImageUrl(() => content.value?.url, { size: 'full' })

const { openDialog } = useGlobalDialog()
</script>

<template>
  <Img
    class="rounded max-w-72 my-1 cursor-pointer"
    @click="content && openDialog('image', { type: 'image', content, alt: content.body })"
    alt="Test"
    :src="url"
    :width="content?.info.w"
    :height="content?.info.h"
    hash-type="blurhash"
    :blurhash="blurhash"
  />
</template>
