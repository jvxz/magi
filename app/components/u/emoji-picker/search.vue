<script lang="ts" setup>
export interface UEmojiPickerSearchProps {
  class?: HTMLAttributes['class']
  ui?: DefineClasses<'wrapper' | 'input'>
}

defineOptions({ inheritAttrs: false })

const props = defineProps<UEmojiPickerSearchProps>()

const modelValue = defineModel<string | number>()
</script>

<template>
  <div :class="cn('px-(--emoji-picker-padding) pt-(--emoji-picker-padding)', props.ui?.wrapper)">
    <EmojiPickerSearch
      v-bind="$attrs"
      v-model:model-value="modelValue"
      :placeholder="$attrs.placeholder ?? 'Search...'"
      :class="cn(inputStyles(), props.class, props.ui?.input)"
    />
  </div>
</template>
