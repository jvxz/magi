<script lang="ts" setup>
import { motionSlideFromTop } from '#imports'
import { SyncState } from 'matrix-js-sdk'
import { AnimatePresence, motion } from 'motion-v'

defineProps<{
  title?: string
}>()

const currentRoom = useCurrentRoom()
const status = useMatrixStatus()

const env = computed<string | undefined>(() => {
  if (isTestMode())
    return 'Testing'

  if (import.meta.dev)
    return 'Development'

  return undefined
})
</script>

<template>
  <header class="flex shrink-0 h-app-header-height items-center justify-between *:shrink-0">
    <div class="flex flex-1 items-center">
      <span v-if="env" class="text-xs text-muted-foreground font-medium ml-2">
        {{ env }}
      </span>
    </div>
    <div class="text-sm font-medium text-center w-auto relative">
      <AnimatePresence mode="popLayout" :initial="true">
        <motion.span
          v-if="!status.clientState"
          key="room"
          v-bind="motionSlideFromTop"
        >
          {{ title ?? currentRoom?.name ?? upperFirst($route.name) }}
        </motion.span>

        <motion.div
          v-else
          id="status"
          v-bind="motionSlideFromTop"
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              v-if="status.clientState === SyncState.Error"
              key="error"
              class="flex gap-2 items-center"
              v-bind="motionSlideFromTop"
            >
              <Icon name="tabler:cloud-off" class="text-danger animate-pulse-alt" />
              <p class="text-danger">
                Disconnected
              </p>
            </motion.div>
            <motion.div
              v-else-if="status.clientState === SyncState.Reconnecting"
              key="reconnecting"
              class="flex gap-2 items-center"
              v-bind="motionSlideFromTop"
            >
              <USpinner class="size-4 stroke-orange-900" />
              <p class="text-sm text-orange-400 font-medium">
                Reconnecting
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
    <div class="flex-1" />
  </header>
</template>
