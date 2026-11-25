<script lang="ts" setup>
export interface UEmojiPickerSearchProps {
  class?: HTMLAttributes['class']
  ui?: DefineClasses<'wrapper' | 'input'>
  variant?: InputVariants['variant']
}

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<UEmojiPickerSearchProps>(), { variant: 'top' })

const modelValue = defineModel<string | number>()
</script>

<template>
  <div :class="cn('px-(--emoji-picker-padding) pt-(--emoji-picker-padding)', props.ui?.wrapper)">
    <EmojiPickerSearch
      v-bind="$attrs"
      v-model:model-value="modelValue"
      :placeholder="$attrs.placeholder ?? 'Search...'"
      :class="cn(inputStyles({ variant }), props.class, props.ui?.input)"
    />
  </div>
</template>
