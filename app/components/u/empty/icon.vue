<script lang="ts" setup>
import type { PrimitiveProps } from 'reka-ui'

const props = withDefaults(
  defineProps<
    Omit<PrimitiveProps, 'asChild'> & {
      name: string
      class?: string
      ui?: DefineClasses<'wrapper' | 'icon'>
      variant?: 'naked' | 'circle'
      size?: 'sm' | 'default' | 'lg'
    }
  >(),
  { size: 'default', variant: 'circle' },
)

const delegated = reactiveOmit(props, ['class', 'name', 'variant', 'size'])
</script>

<template>
  <Primitive
    v-bind="delegated"
    :data-variant="variant"
    :data-size="size"
    :class="
      cn(
        'grid place-items-center group mb-2',
        'data-[variant=circle]:(bg-secondary rounded-full)',
        'data-[size=default]:size-24',
        'data-[size=sm]:size-16',
        'data-[size=lg]:size-32',
        props.class,
        props.ui?.wrapper,
      )
    "
    data-slot="empty-icon"
  >
    <Icon
      :name
      :class="
        cn(
          'text-muted-foreground',
          'group-data-[variant=circle]:(size-1/2)',
          'group-data-[variant=naked]:(size-full)',
          props.ui?.icon,
        )
      "
    />
  </Primitive>
</template>
