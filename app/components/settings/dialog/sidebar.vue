<script lang="ts" setup>
import type { UInputTemplateRef } from '~/components/u/input.vue'
import { useFilter } from 'reka-ui'

const { self } = useSelf()
const { searchQuery, tab } = useSettingsDialog()

onUnmounted(() => tab.value = SETTINGS_DEFAULT_TAB)

const inputRef = useTemplateRef<UInputTemplateRef>('input')
onStartTyping(() => inputRef.value?.inputRef?.focus())

const { contains } = useFilter({ sensitivity: 'base' })

function categorySearchText<K extends SettingsCategory>(categoryKey: K): string {
  const cat = SETTINGS_CATEGORY_METADATA[categoryKey]
  const items = SETTINGS_ITEM_METADATA[categoryKey]
  const fromItems: string[] = []
  for (const [settingKey, meta] of objectEntries(items))
    fromItems.push(String(settingKey), meta.title, meta.description)

  return [cat.key, cat.title, ...fromItems].join(' ')
}

const filteredCategories = computed(() => objectValues(SETTINGS_CATEGORY_METADATA).filter(cat => contains(categorySearchText(cat.key), searchQuery.value.trim())))
</script>

<template>
  <div class="p-4 rounded-l-lg bg-background flex shrink-0 flex-col gap-4 w-64">
    <UButton variant="ghost" class="group text-foreground font-normal shrink-0 gap-3.5 h-14 w-full items-center justify-center">
      <MatrixAvatar
        :user="self?.userId"
        :size="48"
        class="shrink-0"
      />
      <div class="flex flex-col h-full w-full justify-evenly *:w-fit">
        <span class="font-medium">{{ self?.displayName }}</span>
        <span class="text-muted-foreground group-hover:text-foreground">
          Edit Profile
          <Icon name="tabler:pencil-filled" class="h-0.6lh" />
        </span>
      </div>
    </UButton>
    <div class="grid place-items-center">
      <UInput
        ref="input"
        v-model:model-value="searchQuery"
        placeholder="Search"
        class="w-full"
        leading-icon="tabler:search"
      />
    </div>

    <TabsList class="tab-list flex flex-col gap-1 isolate">
      <TabsTrigger
        v-for="entry in filteredCategories"
        :key="entry.key"
        :value="entry.key"
        as-child
        @pointerdown.prevent
        @click="tab = entry.key"
      >
        <UButton
          variant="ghost"
          class="justify-start data-[active]:text-foreground active:bg-card-lighter/50 data-[active]:bg-card-lighter/50 hover:bg-card-lighter/50 data-[active]:anchor-name-item"
        >
          <Icon :name="entry.icon" class="size-4" />
          {{ upperFirst(entry.title) }}
        </UButton>
      </TabsTrigger>

      <div class="rounded bg-card-lighter pointer-events-none duration-100 absolute position-anchor-item anchor-inset ease-snappy -z-1" />
    </TabsList>
  </div>
</template>
