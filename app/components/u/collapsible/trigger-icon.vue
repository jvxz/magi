<template>
  <Icon
    v-bind="$attrs"
    name="tabler:chevron-down"
    :class="cn('shrink-0 size-4 group-data-[state=open]:rotate-180', $attrs.class)"
  />
</template>
