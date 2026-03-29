<template>
  <h2 class="text-lg font-medium" v-bind="$attrs">
    <slot>
      {{ upperFirst($route.name) }}
    </slot>
  </h2>
</template>
