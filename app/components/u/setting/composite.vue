<script lang="ts" setup>
import type { USettingRootProps } from './root.vue'

export interface USettingCompositeProps extends USettingRootProps {
  label?: string
  description?: string
  isLoading?: boolean
}

const props = defineProps<USettingCompositeProps>()

const delegated = reactiveOmit(props, ['label', 'description'])
</script>

<template>
  <USettingRoot v-slot="{ id }" v-bind="delegated">
    <USettingHeader v-if="label || description">
      <slot name="label">
        <USettingTitle>
          <span>{{ label }}</span>
          <USpinner v-if="isLoading" class="h-0.75lh" />
        </USettingTitle>
      </slot>

      <slot name="description">
        <USettingDescription v-if="description">{{ description }}</USettingDescription>
      </slot>
    </USettingHeader>

    <slot :id />
  </USettingRoot>
</template>
