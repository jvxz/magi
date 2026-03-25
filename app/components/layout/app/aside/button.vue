<script lang="ts" setup>
import type { ButtonProps } from '~/components/u/button.vue'

defineProps<ButtonProps & { tooltip?: string }>()

const [DefineButton, Button] = createReusableTemplate()
</script>

<template>
  <DefineButton>
    <UButton
      v-bind="$props"
      :variant="variant ?? 'soft'"
      :class="cn('rounded-xl size-10 flex border-0 items-center justify-center', $props.class)"
    >
      <slot />
    </UButton>
  </DefineButton>

  <UTooltipRoot v-if="tooltip">
    <UTooltipTrigger as-child>
      <Button />
    </UTooltipTrigger>
    <UTooltipContent side="right">
      {{ tooltip }}
    </UTooltipContent>
  </UTooltipRoot>

  <Button v-else />
</template>
