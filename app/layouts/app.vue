<script lang="ts" setup>
import { SplitterGroup, SplitterPanel } from 'reka-ui'

defineProps<{
  asideTitle?: string
}>()

const layout = useCookie<number[]>('splitter:appAside', {
  default: () => [400, 240],
})

const slots = useSlots()

const [DefineHeader, Header] = createReusableTemplate()
</script>

<template>
  <DefineHeader v-slot="{ $slots }">
    <div class="border-b bg-card shrink-0 h-header-height w-full top-0 sticky z-20">
      <component :is="$slots.default" />
    </div>
  </DefineHeader>

  <SettingsDialog />

  <div class="flex flex-col h-screen relative">
    <LayoutAppHeader />
    <main class="bg-card flex-1 h-fit">
      <SplitterGroup
        id="aside-extra-splitter-group"
        direction="horizontal"
        class="h-full"
        @layout="layout = $event"
      >
        <SplitterPanel
          id="aside-extra-splitter-panel-1"
          :default-size="layout[0]"
          :min-size="360"
          :max-size="500"
          class="bg-background shrink-0 top-0 sticky"
          size-unit="px"
        >
          <div class="flex flex-col h-full">
            <div class="flex flex-1 shrink w-full relative">
              <LayoutAppAside />
              <div class="border-l border-t rounded-tl-xl flex flex-col w-full">
                <div
                  class="border-b flex shrink-0 h-[49px] items-center"
                  :class="{
                    'px-4': !slots['aside-header'],
                  }"
                >
                  <slot name="aside-header">
                    <h2 class="text-lg font-medium">
                      {{ asideTitle ?? upperFirst($route.name) }}
                    </h2>
                  </slot>
                </div>
                <div class="pb-3 overflow-y-auto">
                  <slot name="aside" />
                </div>
              </div>
            </div>
            <LayoutAppUserCard />
          </div>
        </SplitterPanel>
        <SplitterResizeHandle id="aside-extra-splitter-resize-handle" class="group relative">
          <div class="bg-muted-foreground opacity-75 h-full w-1.5 pointer-events-none transition-all duration-75 delay-150 ease-in-out inset-0 absolute z-10 z-100 group-data-[state=inactive]:opacity-0 group-data-[state=inactive]:w-0.5 -translate-x-1/2 group-data-[state=inactive]:delay-0" />
        </SplitterResizeHandle>
        <SplitterPanel
          id="aside-extra-splitter-panel-2"
          :default-size="layout[1]"
          size-unit="px"
        >
          <div class="border-t flex flex-col h-full">
            <Header v-if="$slots.header">
              <slot name="header" />
            </Header>

            <slot />
          </div>
        </SplitterPanel>
      </SplitterGroup>
    </main>
    <div
      class="bg-red-500 h-header-height bottom-0 absolute"
      :style="{
        width: `calc(${layout[0]}px + 75px)px`,
      }"
    ></div>
  </div>
</template>
