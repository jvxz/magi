<script lang="ts" setup>
const displayMode = inject<Ref<AsideDisplayMode>>('displayMode')
</script>

<template>
  <div class="px-1 flex items-center justify-between">
    <USelectRoot v-model:model-value="displayMode">
      <USelectTrigger
        v-if="displayMode"
        variant="link"
        class="text-sm text-muted-foreground/80 font-medium p-0 gap-1 h-fit items-center data-[state=open]:(text-foreground no-underline) hover:(text-foreground no-underline) -mx-0"
      >
        <span>{{ ASIDE_DISPLAY_MODES[displayMode] }}</span>
      </USelectTrigger>

      <USelectContent :side-offset="2" :align-offset="-4" align="start">
        <USelectItem v-for="[key, label] in Object.entries(ASIDE_DISPLAY_MODES)" :key :value="key">
          {{ label }}
        </USelectItem>
      </USelectContent>
    </USelectRoot>

    <PageMeCreateChat />
  </div>
</template>
