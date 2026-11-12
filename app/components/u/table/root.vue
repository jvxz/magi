<script lang="ts" setup>
import type { HTMLAttributes } from 'vue'

export interface UTableRootProps {
  class?: HTMLAttributes['class']
  variant?: StaticVariants['variant']
}

const props = withDefaults(defineProps<UTableRootProps>(), { variant: 'default' })
</script>

<template>
  <div :class="cn(staticBase({ variant }), 'rounded p-0 of-clip text-left *:w-full', props.class)">
    <table :data-variant="variant" data-slot="table-root" class="group/table table-auto">
      <slot />
    </table>
  </div>
</template>
