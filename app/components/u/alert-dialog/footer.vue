<script setup lang="ts">
import type { UDialogFooterProps } from '../dialog/footer.vue'

export interface UAlertDialogFooterProps extends UDialogFooterProps {}

const props = defineProps<UAlertDialogFooterProps>()
</script>

<template>
  <UDialogFooter
    :class="cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end w-full', props.class)"
    data-slot="alert-dialog-footer"
  >
    <slot />
  </UDialogFooter>
</template>
