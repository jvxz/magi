<script lang="ts" setup>
import { VList } from 'virtua/vue'

import { injectRoomInstanceContext } from './instance.vue'

const {
  room,
  inputSuggestionItems,
  inputSuggestionListHeight,
  inputHighlightedSuggestionItem,
  inputEditor,
  selectInputSuggestionItem,
  inputSuggestionListOpen,
  inputContent,
  areMembersTyping,
} = injectRoomInstanceContext()

const { client } = useMatrixClient()

const resolveCustomEmojiUrl = (url: string) =>
  resolveImageUrl(url, {
    allowDirectLinks: true,
    baseUrl: client.value.getHomeserverUrl(),
    resizeMethod: 'scale',
    size: 'small',
  })

const vlist = useTemplateRef('vlist')
watch(inputHighlightedSuggestionItem, idx => vlist.value?.scrollToIndex(idx, { align: 'nearest' }))
</script>

<template>
  <div
    class="mb-3 px-3 rounded flex shrink-0 flex-col w-full cursor-text bottom-0 absolute isolate"
    @mousedown="
      e => {
        const { target } = e
        if ((target as Element | undefined)?.closest('button, .ProseMirror')) return
        e.preventDefault()
        inputEditor?.commands.focus('end')
      }
    "
  >
    <RoomInputMembersTyping v-if="!inputSuggestionListOpen" />

    <div
      v-if="inputSuggestionListOpen"
      :class="cn(popoverContentBase(), 'w-full border-border-strong h-full bg-secondary mb-3.5')"
    >
      <VList
        v-if="inputSuggestionItems.length"
        ref="vlist"
        v-slot="{ item, index }"
        :data="inputSuggestionItems"
        :style="{
          minHeight: `${inputSuggestionListHeight}px`,
        }"
      >
        <UButton
          :key="item.id"
          variant="ghost"
          :data-highlighted="inputHighlightedSuggestionItem === index"
          class="gap-2 w-full justify-start data-[highlighted=false]:(text-muted-foreground bg-transparent hover:text-muted-foreground hover:bg-transparent) data-[highlighted=true]:(text-foreground bg-secondary-raised hover:bg-secondary-raised)"
          @mouseenter="inputHighlightedSuggestionItem = index"
          @mousedown.prevent="selectInputSuggestionItem(item)"
        >
          <MatrixRoomMemberAvatar v-if="item.user" class="h-4 w-fit" :room="room" :member="item.user" />
          <MatrixRoomAvatar v-else-if="item.room" class="h-4 w-fit" :room="item.room.room_id" />
          <Twemoji v-else-if="item.emoji.type === 'unicode'" :emoji="item.emoji.emoji.hexcode" />
          <img
            v-else
            :src="resolveCustomEmojiUrl(item.emoji.image.url)"
            :alt="item.emoji.shortcode"
            class="size-4 object-contain"
            decoding="async"
            draggable="false"
          />

          <span class="text-foreground">{{ item.label }}</span>
          <span v-if="!item.emoji" class="text-xs font-normal">{{ item.id }}</span>
        </UButton>
      </VList>

      <UButton v-else variant="ghost" disabled class="gap-2 w-full justify-start opacity-100!">
        <span class="text-muted-foreground font-normal">No results</span>
      </UButton>
    </div>

    <div
      class="px-3.5 py-0 rounded bg-input flex gap-3.5 size-full min-h-user-card-height ring-1 ring-border ring-inset *:shrink-0 has-focus-visible:ring-border-strong"
    >
      <!-- additional inputContent button -->
      <UButton variant="ghost" size="icon" class="mt-[calc((var(--spacing-user-card-height)-2rem)/2)]">
        <Icon :name="ICON__ADD" class="size-5" />
      </UButton>

      <!-- field -->
      <div
        class="py-[calc((var(--spacing-user-card-height)-1.5rem)/2)] flex-1 max-h-128 overflow-scroll overflow-x-hidden scrollbar-gutter-stable"
      >
        <TiptapEditorContent role="presentation" :editor="inputEditor" />
      </div>

      <div class="mt-[calc((var(--spacing-user-card-height)-2rem)/2)] flex gap-1 h-full items-center">
        <!-- emoji button -->
        <RoomInputEmojiPicker />

        <!-- send button -->
        <UButton variant="ghost-raised" size="icon" :disabled="!inputContent">
          <Icon :name="ICON__SEND" class="size-5" />
        </UButton>
      </div>
    </div>

    <div
      v-if="!inputSuggestionListOpen"
      aria-hidden="true"
      class="h-12 w-full pointer-events-none transition-all ease absolute from-surface to-transparent from-75% bg-linear-to-t -mx-3 -z-2"
      :class="areMembersTyping ? '-top-1' : 'bottom-0'"
    />
  </div>
</template>

<style>
.ProseMirror {
  @apply outline-0 flex flex-col justify-center;
}

.tiptap {
  .md-marker {
    @apply text-muted-foreground;
    text-decoration: none;
    font-style: normal;
  }

  .md-codespan:not(.md-marker),
  pre {
    @apply bg-muted font-mono px-0.5 -m-0.25 mx-0.75 rounded-sm;
  }

  .md-em:not(.md-marker) {
    @apply italic;
  }

  .md-link:not(.md-marker) {
    @apply underline text-primary cursor-pointer;
  }

  .md-strikethrough:not(.md-marker) {
    text-decoration: line-through;
  }

  .md-strong:not(.md-marker) {
    @apply font-medium;
  }

  .md-underline:not(.md-marker) {
    @apply underline;
  }

  [data-type='mention'] {
    @apply bg-primary/50 px-0.5 -m-0.25 mx-0.75 rounded-sm;
    user-select: auto;
  }

  p.is-editor-empty:first-child::before {
    @apply text-muted-foreground h-0 pointer-events-none;
    content: attr(data-placeholder);
    float: left;
  }

  blockquote {
    @apply border-l-3 border-border-strong pl-3 text-muted-foreground;
  }

  h1 {
    @apply text-4xl;
  }
  h2 {
    @apply text-3xl;
  }
  h3 {
    @apply text-2xl;
  }
  h4 {
    @apply text-xl;
  }

  li p {
    display: inline;
  }

  ul,
  ol {
    padding-left: 1.5em;
    list-style-type: disc;
  }

  ul ul {
    list-style-type: circle;
  }
  ul ul ul {
    list-style-type: square;
  }
}
</style>
