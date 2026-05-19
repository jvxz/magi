<script lang="ts" setup>
defineProps<{
  ui?: DefineClasses<'wrapper' | 'input'>
}>()

const modelValue = defineModel<string | number>()
</script>

<template>
  <div :class="cn('px-(--emoji-picker-padding) pt-(--emoji-picker-padding)', $props.ui?.wrapper)">
    <EmojiPickerSearch
      v-bind="$attrs"
      v-model:model-value="modelValue"
      :placeholder="$attrs.placeholder ?? 'Search...'"
      :class="cn(inputStyles(), $attrs.class, $props.ui?.input)"
    />
  </div>
</template>
