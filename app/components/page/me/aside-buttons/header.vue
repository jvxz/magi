<script lang="ts" setup>
const displayMode = inject<Ref<AsideDisplayMode>>('displayMode')
</script>

<template>
  <div class="flex items-center px-1 justify-between">
    <USelectRoot v-model:model-value="displayMode">
      <USelectTrigger
        v-if="displayMode"
        variant="link"
        class="text-sm text-muted-foreground/80 hover:(text-foreground no-underline) data-[state=open]:(text-foreground no-underline) font-medium p-0 -mx-0 h-fit gap-1 items-center"
      >
        <span>{{ ASIDE_DISPLAY_MODES[displayMode] }}</span>
      </USelectTrigger>

      <USelectContent :side-offset="2" :align-offset="-4" align="start">
        <USelectItem :value="key" v-for="[key, label] in Object.entries(ASIDE_DISPLAY_MODES)" :key>
          {{ label }}
        </USelectItem>
      </USelectContent>
    </USelectRoot>

    <PageMeCreateChat />
  </div>
</template>
