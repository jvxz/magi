<script lang="ts" setup>
import { PageLoginFlowPw, PageLoginFlowSso } from '#components'
import { injectLoginPageEditableStateContext } from '~/pages/login/new.vue'

const {
  editableInput: homeserverInput,
  editableState,
  isPending,
  refreshHook,
  error: contextError,
} = injectLoginPageEditableStateContext()

const {
  data: loginFlows,
  isFetching,
  isSuccess,
  refetch,
  isError,
  error,
  dataUpdatedAt,
} = useHomeserverLoginFlows(homeserverInput)
const parsedError = useParseError(error)

const flows = computed(() =>
  [
    getPwFlow(loginFlows.value?.flows ?? []) && PageLoginFlowPw,
    getSSOFlow(loginFlows.value?.flows ?? []) && PageLoginFlowSso,
  ].filter(c => !!c),
)

syncRef(isFetching, isPending)
refreshHook.on(() => refetch())

watch(dataUpdatedAt, () => (contextError.value = undefined))
</script>

<template>
  <div
    :class="{
      'opacity-50': editableState === 'edit',
    }"
  >
    <div v-if="isSuccess && !isFetching" class="flex flex-col gap-3">
      <template v-for="(flow, i) in flows" :key="i">
        <div v-if="i > 0" class="flex items-center gap-3 my-1">
          <USeparator class="shrink" />
          <span class="shrink-0 text-xs text-muted-foreground">or</span>
          <USeparator class="shrink" />
        </div>

        <component :is="flow" />
      </template>
    </div>

    <UAlertRoot v-else-if="isError" variant="danger">
      <UAlertIcon name="tabler:exclamation-circle" class="shrink-0" />

      <UAlertContent>
        <UAlertTitle>{{ parsedError.title }}</UAlertTitle>
        <UAlertDescription>{{ parsedError.message }}</UAlertDescription>
      </UAlertContent>
    </UAlertRoot>

    <div v-else-if="isFetching" class="text-sm flex items-center gap-2 mx-auto w-fit">
      <USpinner class="size-1lh" />
      <span class="font-medium">Fetching login methods...</span>
    </div>
  </div>
</template>
