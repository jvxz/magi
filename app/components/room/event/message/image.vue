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
    @click="content?.url && openDialog('image', { type: 'image', url: content.url, alt: content.body, blurhash })"
    :alt="content?.body"
    :src="url"
    :width="content?.info?.w"
    :height="content?.info?.h"
    hash-type="blurhash"
    :blurhash="blurhash"
  />
</template>
