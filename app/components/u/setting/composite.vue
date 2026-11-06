<script lang="ts" setup>
import type { USettingRootProps } from './root.vue'

export interface USettingCompositeProps extends USettingRootProps {
  label?: string
  description?: string
}

const props = defineProps<USettingCompositeProps>()

const delegated = reactiveOmit(props, ['label', 'description'])
</script>

<template>
  <USettingRoot v-slot="{ id }" v-bind="delegated">
    <USettingHeader>
      <USettingTitle>{{ label }}</USettingTitle>
      <USettingDescription v-if="description">{{ description }}</USettingDescription>
    </USettingHeader>

    <slot :id />
  </USettingRoot>
</template>
