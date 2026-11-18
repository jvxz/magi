<script lang="ts" setup>
import type { DialogRootProps } from 'reka-ui'

import type { GlobalDialogMap } from '~/composables/use-global-dialog'

export type DialogTextProps = DialogRootProps & GlobalDialogMap['text']

const props = withDefaults(defineProps<DialogTextProps>(), { modal: true })

const open = defineModel<boolean>('open')

const delegated = reactiveOmit(props, ['title', 'text', 'open'])
</script>

<template>
  <UDialogRoot v-bind="delegated" v-model:open="open">
    <UDialogContent>
      <UDialogHeader>
        <UDialogTitle class="truncate"> {{ title }} </UDialogTitle>
      </UDialogHeader>

      <div class="overflow-y-scroll">
        <p class="whitespace-pre-wrap">{{ text }}</p>
      </div>

      <UDialogFooter>
        <UDialogClose> Close </UDialogClose>
      </UDialogFooter>
    </UDialogContent>
  </UDialogRoot>
</template>
