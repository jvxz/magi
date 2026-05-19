<script lang="ts" setup>
import type { UInputRef } from '../u/input.vue'
import { getEmojiKey, injectEmojiPickerContext } from './root.vue'

defineProps<{ disabled?: boolean }>()

const { activeEmoji, isInputFocused, onPick, searchQuery, triggerInputMove } = injectEmojiPickerContext()
const modelValue = defineModel<string | number>('modelValue', {
  get: () => searchQuery.value,
  set: v => (searchQuery.value = String(v)),
  validator: v => typeof v === 'string' || typeof v === 'number',
})

const inputEl = useTemplateRef<UInputRef>('inputEl')
const { focused: isInputFocusedLocal } = useFocus(
  computed(() => inputEl.value?.$el),
  { initialValue: true },
)
syncRef(isInputFocusedLocal, isInputFocused)

onStartTyping(() => (isInputFocusedLocal.value = true))

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    triggerInputMove({ dir: 'down' })
  } else if (e.key === 'Enter' && onPick) {
    if (activeEmoji.value) {
      e.preventDefault()
      e.stopPropagation()
      onPick(activeEmoji.value)
    }
  }
}
</script>

<template>
  <input
    v-bind="$attrs"
    ref="inputEl"
    v-model="modelValue"
    :disabled="$props.disabled"
    :aria-activedescendant="activeEmoji ? getEmojiKey(activeEmoji) : undefined"
    data-slot="emoji-picker-search"
    :class="$attrs.class"
    @keydown="onKeydown"
  />
</template>
