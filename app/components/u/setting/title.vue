<script lang="ts" setup>
import type { ULabelProps } from '../label.vue'

import { injectSettingContext } from './root.vue'

export type USettingTitleProps = ULabelProps

const props = defineProps<USettingTitleProps>()

const delegated = reactiveOmit(props, 'class')

const { id } = injectSettingContext()
</script>

<template>
  <ULabel v-bind="delegated" :for="id" :class="cn('text-base font-medium m-0', props.class)" data-slot="setting-title">
    <slot />
  </ULabel>
</template>
