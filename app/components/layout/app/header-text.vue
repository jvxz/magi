<script lang="ts" setup>
import type { MotionProps } from 'motion-v'
import { SyncState } from 'matrix-js-sdk'
import { AnimatePresence, motion } from 'motion-v'

const status = useMatrixStatus()
const currentRoom = useCurrentRoom()

const { $ready } = useNuxtApp()
const route = useRoute()
const roomLabel = computed(() => currentRoom.value?.name ?? upperFirst(route.name))

const showInitializing = computed(() =>
  !$ready || !status.value.isDataSynced || !roomLabel.value,
)

const motionProps: MotionProps = {
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  initial: { opacity: 0, y: 20 },
  transition: { duration: 0.20, ease: [0.33, 1, 0.68, 1] },
}
</script>

<template>
  <div class="text-sm font-medium text-center w-auto relative">
    <AnimatePresence mode="popLayout" :initial="false">
      <motion.div
        v-if="!status.clientState && !showInitializing"
        key="room"
        v-bind="motionProps"
      >
        {{ roomLabel }}
      </motion.div>

      <motion.div
        v-else-if="showInitializing"
        key="ready"
        class="flex gap-2 items-center"
        v-bind="motionProps"
      >
        <USpinner class="size-4" />
        <p class="text-sm font-medium">
          Initializing
        </p>
      </motion.div>

      <motion.div
        v-else-if="status.clientState === SyncState.Error"
        key="error"
        class="flex gap-2 items-center"
        v-bind="motionProps"
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
        v-bind="motionProps"
      >
        <USpinner class="size-4 stroke-orange-900" />
        <p class="text-sm text-orange-400 font-medium">
          Reconnecting
        </p>
      </motion.div>
    </AnimatePresence>
  </div>
</template>
