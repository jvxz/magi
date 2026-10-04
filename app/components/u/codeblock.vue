<script lang="ts" setup>
// oxlint-disable-next-line import/no-unassigned-import
import 'microlighter/micro-lighter-element.min.js'
import type { UCardProps } from './card/index.vue'
export interface UCodeblockRootProps extends UCardProps {
  lang?: string
  input: string
  dialog?: boolean
  header?: boolean
  copy?: boolean
  ui?: DefineClasses<'root' | 'header' | 'copyButton' | 'container'>
}

const props = withDefaults(defineProps<UCodeblockRootProps>(), {
  copy: true,
  dialog: true,
  header: false,
})

const { openDialog } = useGlobalDialog()

const delegated = reactiveOmit(props, 'class')

const code = computed(() => props.input.trim().replace(REGEX__TRAILING_NEWLINE, ''))
watchImmediate(code, () => nextTick(() => document.dispatchEvent(new Event('syntax-highlight'))), {
  flush: 'post',
})

const microlighterRoot = useTemplateRef('microlighter')

const { isYOverflowed } = useElementOverflow(microlighterRoot)
</script>

<template>
  <UCard
    v-bind="delegated"
    data-slot="codeblock-root"
    :class="cn('p-0 bg-surface gap-0 shadow-none text-sm overflow-clip', props.class, ui?.root)"
  >
    <header
      v-if="header"
      :class="
        cn('w-full overflow-clip shrink-0 h-8 flex items-center justify-between px-2 font-mono text-xs', ui?.header)
      "
    >
      <span class="ps-1 select-none">{{ lang }}</span>

      <div class="flex gap-px items-center">
        <UButton
          v-if="dialog"
          title="View in dialog"
          size="icon-xs"
          variant="ghost"
          @click="openDialog('codeViewer', { code, lang })"
        >
          <Icon :name="ICON__CODE" />
        </UButton>

        <UCopyButton v-if="copy" size="icon-xs" :value="code" />

        <slot name="header-buttons" />
      </div>
    </header>

    <div
      :class="
        cn(
          'bg-codeblock rounded select-auto relative bg-background flex flex-col flex-1 min-h-0',
          header && 'border-t',
          ui?.container,
        )
      "
    >
      <UCopyButton
        v-if="props.copy && !props.header"
        size="icon-sm"
        :value="code"
        :class="
          cn('absolute top-2 opacity-50 hover:opacity-100', isYOverflowed ? 'right-4.5' : 'right-2', ui?.copyButton)
        "
      />

      <micro-lighter ref="microlighter" :language="lang" line-numbers class="overflow-y-auto scrollbar-fancy">
        <pre class="p-2"><code v-text="code"/></pre>
      </micro-lighter>
    </div>
  </UCard>
</template>
