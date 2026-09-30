<template>
  <Icon
    v-bind="$attrs"
    :name="ICON__CHEVRON_DOWN"
    :class="cn('shrink-0 size-4 group-data-[state=open]:rotate-180', $attrs.class)"
  />
</template>
